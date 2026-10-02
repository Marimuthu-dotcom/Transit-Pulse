-- 4. Route <-> Stop ordering (which stops a route hits, in order)
CREATE TABLE route_stops (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    route_id        BIGINT UNSIGNED NOT NULL,
    stop_id         BIGINT UNSIGNED NOT NULL,
    stop_order      SMALLINT UNSIGNED NOT NULL,     -- 1, 2, 3... sequence along the route
    eta_offset_min  SMALLINT UNSIGNED NULL,          -- scheduled minutes from route start
    UNIQUE KEY uq_route_stop_order (route_id, stop_order),
    KEY idx_route_stops_stop (stop_id),
    CONSTRAINT fk_route_stops_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_route_stops_stop  FOREIGN KEY (stop_id)  REFERENCES stops(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;