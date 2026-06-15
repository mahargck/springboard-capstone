DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    plant_hardiness_zone DECIMAL(2, 1),
    zip_code DECIMAL(5),
    state VARCHAR(2),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_email UNIQUE (email)
);
GRANT ALL PRIVILEGES ON users TO web;
GRANT USAGE, SELECT ON SEQUENCE users_user_id_seq TO web;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO web;

-- Passwords should be hashed in a real application, but for simplicity, we are using plain text here.
INSERT INTO users (email, password, plant_hardiness_zone, zip_code, state, is_admin) VALUES
('Admin User', 'adminpassword', 5.0, 12345, 'CA', TRUE),
('Graham Kryger', 'password123', null, null, 'WA', TRUE);

Select * from users;

