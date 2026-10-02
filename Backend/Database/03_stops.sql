-- 3. Stops (SavedStopsPage, TransitGoogleMap markers)
CREATE TABLE stops (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    stop_name       VARCHAR(150)    NOT NULL,
    latitude        DECIMAL(10,7)   NOT NULL,
    longitude       DECIMAL(10,7)   NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;