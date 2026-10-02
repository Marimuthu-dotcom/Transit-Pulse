-- 5. Vehicles / buses (Backend's hardcoded fleet: 101, 42A, 10B, EXP4, 108, 77)
CREATE TABLE vehicles (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_number  VARCHAR(20)     NOT NULL,
    route_id        BIGINT UNSIGNED NOT NULL,
    capacity        SMALLINT UNSIGNED NOT NULL DEFAULT 50,
    status          ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_vehicles_number (vehicle_number),
    KEY idx_vehicles_route (route_id),
    CONSTRAINT fk_vehicles_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;