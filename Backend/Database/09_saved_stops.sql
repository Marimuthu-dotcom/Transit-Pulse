-- 9. Saved stops (SavedStopsPage.jsx)
CREATE TABLE saved_stops (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    stop_id         BIGINT UNSIGNED NOT NULL,
    saved_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saved_stops (user_id, stop_id),
    CONSTRAINT fk_saved_stops_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_stops_stop FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;