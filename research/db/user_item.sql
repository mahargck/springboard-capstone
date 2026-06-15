DROP TABLE IF EXISTS user_item;
CREATE TABLE user_item (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    item_id INT REFERENCES topic_item(id) ON DELETE CASCADE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL PRIVILEGES ON user_item TO web;
GRANT USAGE, SELECT ON SEQUENCE user_item_id_seq TO web;


INSERT INTO user_item (user_id, item_id, qty, comments) VALUES
(1, 1, 2, 'Planted in the backyard'),
(1, 2, 5, 'Used for firewood'),
(2, 1, 1, 'Planted in the front yard');

