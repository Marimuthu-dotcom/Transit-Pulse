-- 8. Saved routes (SavedRoutesPage.jsx)
CREATE TABLE saved_routes (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    route_id        BIGINT UNSIGNED NOT NULL,
    saved_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saved_routes (user_id, route_id),
    CONSTRAINT fk_saved_routes_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_saved_routes_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;