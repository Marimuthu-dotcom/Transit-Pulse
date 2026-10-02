-- 2. Routes (SearchFormPage, CompareRoutesPage, SavedRoutesPage)
CREATE TABLE routes (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    route_number    VARCHAR(20)     NOT NULL,      -- e.g. '101', '42A', 'EXP4'
    route_name      VARCHAR(150)    NOT NULL,
    origin          VARCHAR(150)    NOT NULL,
    destination     VARCHAR(150)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_routes_number (route_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;