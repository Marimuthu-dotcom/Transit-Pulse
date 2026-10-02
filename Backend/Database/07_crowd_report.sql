-- 7. Crowd reports (ReportCrowdPage.jsx, CrowdBadge.jsx)
CREATE TABLE crowd_reports (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,            -- nullable: allow anonymous reports
    crowd_level     ENUM('low','medium','high') NOT NULL,
    reported_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_crowd_reports_vehicle (vehicle_id),
    KEY idx_crowd_reports_user (user_id),
    CONSTRAINT fk_crowd_reports_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_crowd_reports_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;