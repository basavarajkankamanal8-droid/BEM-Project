import React, { createContext, useContext, useState, useEffect } from "react";
import { dataStore } from "../services/dataStore";
import { GnssSimulator } from "../services/gnssSimulator";
import { ValidationPipeline } from "../services/validationPipeline";

const TelemetryContext = createContext();

export const TelemetryProvider = ({ children }) => {
  const [satellites, setSatellites] = useState(() => dataStore.get("satellites"));
  const [activeGnss, setActiveGnss] = useState(() => {
    const list = dataStore.get("gnss_readings");
    return list[0] || GnssSimulator.generateReading({});
  });
  const [alerts, setAlerts] = useState(() => dataStore.get("alerts"));
  const [sensorReadings, setSensorReadings] = useState(() => dataStore.get("sensor_readings"));
  const [securityEvents, setSecurityEvents] = useState(() => dataStore.get("security_events"));
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);

  // Sync state from storage events
  useEffect(() => {
    const syncAll = () => {
      setSatellites(dataStore.get("satellites"));
      setAlerts(dataStore.get("alerts"));
      setSensorReadings(dataStore.get("sensor_readings"));
      setSecurityEvents(dataStore.get("security_events"));
      const readings = dataStore.get("gnss_readings");
      if (readings.length > 0) setActiveGnss(readings[0]);
    };

    window.addEventListener("aeris_satellites_update", syncAll);
    window.addEventListener("aeris_alerts_update", syncAll);
    window.addEventListener("aeris_gnss_readings_update", syncAll);
    window.addEventListener("aeris_security_events_update", syncAll);
    window.addEventListener("aeris_sensor_readings_update", syncAll);

    return () => {
      window.removeEventListener("aeris_satellites_update", syncAll);
      window.removeEventListener("aeris_alerts_update", syncAll);
      window.removeEventListener("aeris_gnss_readings_update", syncAll);
      window.removeEventListener("aeris_security_events_update", syncAll);
      window.removeEventListener("aeris_sensor_readings_update", syncAll);
    };
  }, []);

  // Periodic heartbeat simulation
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      // Subtle micro-drift of active GNSS
      setActiveGnss(prev => {
        const next = GnssSimulator.generateReading({
          satelliteId: prev.satelliteId,
          latitude: prev.latitude,
          longitude: prev.longitude,
          altitude: prev.altitude,
          signalQuality: prev.signalQuality,
          satelliteCount: prev.satelliteCount
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Generate and validate custom GNSS reading
  const submitGnssReading = (readingParams) => {
    const syntheticReading = GnssSimulator.generateReading(readingParams);
    
    // Pass through PRD §8 Validation Pipeline
    const { status, report } = ValidationPipeline.processIncomingPayload({
      ...syntheticReading,
      timestamp: syntheticReading.timestamp
    });

    if (status === "ACCEPTED") {
      dataStore.add("gnss_readings", syntheticReading);
      setActiveGnss(syntheticReading);
      return { success: true, message: "GNSS Telemetry frame validated & stored." };
    } else {
      return { 
        success: false, 
        message: `Telemetry quarantined by pipeline at stage: ${report.stage}. Check Security Center.` 
      };
    }
  };

  return (
    <TelemetryContext.Provider
      value={{
        satellites,
        activeGnss,
        alerts,
        sensorReadings,
        securityEvents,
        isSimulatingLive,
        setIsSimulatingLive,
        submitGnssReading
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
