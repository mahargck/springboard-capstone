DROP TABLE IF EXISTS topics;
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    division VARCHAR(255) NOT NULL,
    section VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    order_id INTEGER,
    isvisible BOOLEAN DEFAULT TRUE,
    logo VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL PRIVILEGES ON topics TO web;
ALTER TABLE topics DROP COLUMN IF EXISTS category;
ALTER TABLE topics ADD COLUMN category VARCHAR(255);
ALTER TABLE topics RENAME COLUMN topic_id TO id;



INSERT INTO topics (division, section, name, order_id, logo, description) VALUES
    ('animals', 'Insect', 'Bee', 0, '../src/assets/images/sk-bee.png', 'Bees are a colony insect renound for their ability to collect nector and turn it into honey.'),
    ('animals', 'Poultry', 'Quail', 1, '../src/assets/images/sk-quail.png', 'Quails are small birds that are commonly raised for their meat and eggs.'),
    ('animals', 'Poultry', 'Chicken', 2, '../src/assets/images/sk-chicken.png', 'Chickens are domesticated birds that are commonly raised for their meat and eggs.'),
    ('animals', 'Poultry', 'Duck', 3, '../src/assets/images/sk-duck.png', 'Ducks are waterfowl that are commonly raised for their meat and eggs.'),
    ('animals', 'Poultry', 'Geese', 4, 'null', 'Geese are waterfowl that are commonly raised for their meat and eggs.'),
    ('animals', 'Poultry', 'Turkey', 5, '../src/assets/images/sk-turkey.png', 'Turkeys are large birds that are commonly raised for their meat.'),
    ('animals', 'Small Livestock', 'Rabbit', 6, '../src/assets/images/sk-rabbit.png', 'Rabbits are small mammals that are commonly raised for their meat and fur.'),
    ('animals', 'Large Livestock', 'Goat', 7, '../src/assets/images/sk-goat.png', 'Goats are domesticated animals that are commonly raised for their milk, meat, and hides.'),
    ('animals', 'Large Livestock', 'Sheep', 8, '../src/assets/images/sk-sheep.png', 'Sheep are domesticated animals that are commonly raised for their wool, meat, and milk.'),
    ('animals', 'Large Livestock', 'Pig', 9, '../src/assets/images/sk-pig.png', 'Pigs are domesticated animals that are commonly raised for their meat and hides.'),
    ('animals', 'Large Livestock', 'Cow', 10, '../src/assets/images/sk-cow.png', 'Cows are domesticated animals that are commonly raised for their milk, meat, and hides.'),
    ('animals', 'Large Livestock', 'Horse', 11, '../src/assets/images/sk-horse.png', 'Text'),
    ('animals', 'Gardian', 'Dog', 12, '../src/assets/images/sk-dog.png', 'Text'),
    ('firewood', 'Firewood', 'Firewood', 1, '../src/assets/images/sk-firewood.png', 'For many homesteaders, firewood is an essential resource for heating and cooking. Whether you have a wood stove, fireplace, or outdoor fire pit, having a reliable supply of firewood is crucial for survival in a homestead environment. Firewood can be used for heating, cooking, and even as a source of light. It is important to have a good understanding of the different types of firewood, how to properly store it, and how to safely use it. In this section, we will cover everything you need to know about firewood regarding selecting the right type of wood to building a fire and maintaining it throughout the winter months.'),
    ('plants', 'Sort Term', 'Flowers', 1, '../src/assets/images/sk-flower.png', 'Text'),
    ('plants', 'Sort Term', 'Roots', 2, '../src/assets/images/sk-root.png', 'Text'),
    ('plants', 'Sort Term', 'Vines', 3, '../src/assets/images/sk-vine.png', 'Text'),
    ('plants', 'Long Term', 'Trees', 4, '../src/assets/images/sk-tree.png', 'Text');

ALTER TABLE topics ADD COLUMN isvisible BOOLEAN DEFAULT true;

Select * from topics;