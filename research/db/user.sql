DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    plant_hardiness_zone DECIMAL(2, 1),
    zip_code DECIMAL(5),
    state VARCHAR(2),
    is_admin BOOLEAN DEFAULT FALSE
);

INSERT INTO users (name, password, email, plant_hardiness_zone, zip_code, state, is_admin) VALUES
('Admin User', 'adminpassword', 'admin@example.com', 5.0, 12345, 'CA', TRUE),
('Graham Kryger', 'password123', 'mahargck@gmail.com', null, null, 'WA', TRUE);

Select * from users;

