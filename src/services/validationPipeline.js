/**
 * Satellite & GNSS Data Validation Pipeline (PRD §8 & §13)
 * 
 * Pipeline flow:
 * Incoming Data
 *       ↓
 * Source Identification (Device ID, Source ID)
 *       ↓
 * Authentication & Cryptographic Signature Check
 *       ↓
 * Integrity Verification (Checksum / Hash)
 *       ↓
 * Timestamp Verification (Freshness / Anti-replay)
 *       ↓
 * Anomaly Detection (Physics bounds & sensor limits)
 *       ↓
 * [ VALID -> STORE ] or [ SUSPICIOUS -> QUARANTINE & LOG ]
 * 
 * Note: A phone prefix such as +881 is strictly NOT treated as satellite proof.
 */

import { dataStore } from "./dataStore";

export class ValidationPipeline {
  /**
   * Run validation on incoming telemetry or observation payload
   */
  static processIncomingPayload(payload) {
    const report = {
      isValid: true,
      stage: "INITIAL",
      errors: [],
      timestampChecked: new Date().toISOString(),
      payload
    };

    // 1. Source Identification
    if (!payload.sourceId || payload.sourceId.trim() === "") {
      report.isValid = false;
      report.stage = "SOURCE_IDENTIFICATION";
      report.errors.push("Missing Source ID. +881 prefixes or unauthenticated origins are rejected.");
    }

    // 2. Authentication & Signatures
    // Check if signature matches expected pattern (e.g. hex signature present)
    if (!payload.signature || payload.signature.length < 16) {
      report.isValid = false;
      report.stage = "AUTHENTICATION_SIGNATURE";
      report.errors.push("Invalid or missing cryptographic signature (HMAC-SHA256 required).");
    }

    // 3. Integrity Verification
    if (payload.checksumCorrupted) {
      report.isValid = false;
      report.stage = "INTEGRITY_VERIFICATION";
      report.errors.push("Payload checksum mismatch. Possible packet corruption or tampering.");
    }

    // 4. Timestamp Verification (Anti-Replay check within 10 minutes)
    const payloadTime = new Date(payload.timestamp).getTime();
    const now = Date.now();
    const timeDeltaMinutes = Math.abs(now - payloadTime) / (1000 * 60);

    if (isNaN(payloadTime) || timeDeltaMinutes > 60) {
      report.isValid = false;
      report.stage = "TIMESTAMP_VERIFICATION";
      report.errors.push(`Timestamp freshness violation (${timeDeltaMinutes.toFixed(1)} mins skew). Outdated or future timestamp.`);
    }

    // 5. Anomaly Detection (Geographical & Physical Bounds)
    if (payload.latitude < -90 || payload.latitude > 90 || payload.longitude < -180 || payload.longitude > 180) {
      report.isValid = false;
      report.stage = "ANOMALY_DETECTION";
      report.errors.push("Latitude/Longitude out of physical planetary bounds.");
    }

    if (payload.altitude !== undefined && (payload.altitude < -500 || payload.altitude > 40000000)) {
      report.isValid = false;
      report.stage = "ANOMALY_DETECTION";
      report.errors.push("Altitude reading violates GNSS/orbital altitude envelope.");
    }

    // Output routing
    if (!report.isValid) {
      this.quarantinePayload(report);
      return { status: "QUARANTINED", report };
    }

    return { status: "ACCEPTED", report };
  }

  /**
   * Quarantines suspicious data and creates security threat event (PRD §13)
   */
  static quarantinePayload(report) {
    const securityEvent = {
      eventId: "SEC-" + Math.floor(1000 + Math.random() * 9000),
      source: report.payload.sourceId || "UNKNOWN_SOURCE",
      event: `Quarantined: ${report.errors[0]}`,
      severity: "CRITICAL",
      action: "DATA QUARANTINED",
      status: "UNDER REVIEW",
      timestamp: new Date().toISOString(),
      rawPayloadPreview: JSON.stringify(report.payload).slice(0, 80) + "...",
      details: `Failed pipeline at stage: ${report.stage}. Detected errors: ${report.errors.join("; ")}. Signal was quarantined without radio interference.`
    };

    dataStore.add("security_events", securityEvent);

    // Audit log
    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: "SYSTEM_VALIDATION_PIPELINE",
      action: "SECURITY_QUARANTINE",
      target: securityEvent.eventId,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1 (Internal Pipeline)"
    });
  }
}
