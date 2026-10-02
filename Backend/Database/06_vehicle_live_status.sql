-- 6. Live vehicle telemetry (LiveEtaCountdown.jsx -> GET /api/transit/live-eta?vehicleId=)
-- One row per vehicle, overwritten on each ping. Use a separate time-series table
-- (vehicle_position_history) instead if you need historical playback.
CREATE TABLE vehicle_live_status (
    vehicle_id      BIGINT UNSIGNED PRIMARY KEY,
    latitude        DECIMAL(10,7)   NOT NULL,
    longitude       DECIMAL(10,7)   NOT NULL,
    speed_kmph      DECIMAL(5,2)    NULL,
    eta_seconds     INT UNSIGNED    NULL,
    crowd_level     ENUM('low','medium','high') NOT NULL DEFAULT 'low',
    last_updated    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_live_status_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;