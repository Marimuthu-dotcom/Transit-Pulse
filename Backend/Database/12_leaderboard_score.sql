-- 12. Leaderboard (DashboardPage.jsx references a leaderboard; derived from crowd_reports activity)
CREATE TABLE leaderboard_scores (
    user_id         BIGINT UNSIGNED PRIMARY KEY,
    reports_count   INT UNSIGNED NOT NULL DEFAULT 0,
    points          INT UNSIGNED NOT NULL DEFAULT 0,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leaderboard_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;