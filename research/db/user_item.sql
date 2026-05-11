DROP TABLE IF EXISTS user_item;
CREATE TABLE user_item (
    id SERIAL PRIMARY KEY,
    user_id REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key referencing users.
    item_id REFERENCES page_item(id) ON DELETE CASCADE, -- Foreign key referencing items.
    qty INTEGER NOT NULL DEFAULT 1,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO user_item (user_id, item_id, qty, comments) VALUES
(1, 1, 2, 'Planted in the backyard'),
(1, 2, 5, 'Used for firewood'),
(2, 1, 1, 'Planted in the front yard');