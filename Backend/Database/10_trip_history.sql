-- 10. Trip history (TripHistoryPage.jsx)
CREATE TABLE trip_history (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    route_id            BIGINT UNSIGNED NOT NULL,
    vehicle_id          BIGINT UNSIGNED NULL,
    boarding_stop_id    BIGINT UNSIGNED NULL,
    alighting_stop_id   BIGINT UNSIGNED NULL,
    started_at          TIMESTAMP   NOT NULL,
    ended_at            TIMESTAMP   NULL,
    KEY idx_trip_history_user (user_id),
    CONSTRAINT fk_trip_history_user      FOREIGN KEY (user_id)           REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_trip_history_route     FOREIGN KEY (route_id)          REFERENCES routes(id)   ON DELETE SET NULL,
    CONSTRAINT fk_trip_history_vehicle   FOREIGN KEY (vehicle_id)        REFERENCES vehicles(id) ON DELETE SET NULL,
    CONSTRAINT fk_trip_history_board     FOREIGN KEY (boarding_stop_id)  REFERENCES stops(id)    ON DELETE SET NULL,
    CONSTRAINT fk_trip_history_alight    FOREIGN KEY (alighting_stop_id) REFERENCES stops(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;