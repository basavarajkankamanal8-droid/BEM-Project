/**
 * Instagram / Meta Graph API Secure Workflow Bridge (PRD §15 & §18)
 * 
 * Strict Architectural Rule:
 * Satellite Data -> Analysis -> Alert -> Human Verification -> Admin Approval -> Public Post -> Instagram
 * 
 * Never expose raw Meta App Secret or long-lived User Tokens in the frontend.
 * This service structures payloads according to official Meta Graph API specifications
 * and provides mock endpoint staging and preview generation.
 */

import { dataStore } from "./dataStore";

export class InstagramService {
  /**
   * Generates formatted Instagram caption adhering to official AERIS safety formatting
   */
  static formatOfficialAlertCaption({ title, location, category, severity, timestamp, verifiedBy, changeDelta }) {
    const alertIcons = {
      FLOOD_WATER: "🌊",
      TERRAIN_LANDSLIDE: "🏔",
      ENVIRONMENTAL: "🌱",
      ATMOSPHERIC: "🌫",
      TEMPERATURE: "🌡"
    };

    const icon = alertIcons[category] || "🚨";

    return `${icon} OFFICIAL ENVIRONMENTAL UPDATE | BHARAT EARTH MONITOR (BEM)

📍 Location: ${location}
⚠️ Event: ${title}
🔍 Severity: ${severity}
📊 Detected Change: ${changeDelta || "Threshold Exceeded"}
🕒 Detection Time: ${new Date(timestamp).toUTCString()}
🛡 Verification: Verified by ${verifiedBy || "Super Admin"}
🛰 Data Provenance: Bharat Earth Monitor System [SIMULATION DATA]

Official public advisory has been published to the BEM Public Portal.
Citizen safety notice: Please refer to local district emergency services for ground directives.

#BharatEarthMonitor #BEM #EarthObservation #SatelliteMonitoring #PublicSafety`;
  }

  /**
   * Stage approved alert for Instagram distribution
   */
  static stagePublicPost({ alert, approvedBy, customCaption, mediaUrl }) {
    if (!approvedBy) {
      throw new Error("Human admin verification required before publishing to public channels.");
    }

    const postId = "POST-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900);
    const caption = customCaption || this.formatOfficialAlertCaption({
      title: alert.description,
      location: alert.location,
      category: alert.type,
      severity: alert.severity,
      timestamp: alert.createdAt,
      verifiedBy: approvedBy
    });

    const postPayload = {
      postId,
      alertId: alert.alertId,
      headline: `🚨 ${alert.type.replace(/_/g, " ")}: ${alert.location}`,
      location: alert.location,
      detectionTime: alert.createdAt,
      status: "PUBLISHED",
      channel: "OFFICIAL_INSTAGRAM",
      externalUrl: `https://instagram.com/p/bem_official_${postId.toLowerCase()}`,
      caption: caption,
      mediaUrl: mediaUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      postedAt: new Date().toISOString(),
      approvedBy: approvedBy,
      metaGraphApiStatus: {
        containerId: "179283749281749",
        statusCode: 200,
        publishedInstagramMediaId: "1802938475928174"
      }
    };

    // Store in public_posts
    dataStore.add("public_posts", postPayload);

    // Update alert status
    dataStore.update("alerts", a => a.alertId === alert.alertId, { status: "public_posted" });

    // Audit log
    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: approvedBy,
      action: "INSTAGRAM_POST_APPROVED",
      target: postId,
      timestamp: new Date().toISOString(),
      ipAddress: "10.0.4.1 (Admin Console)"
    });

    return postPayload;
  }
}
