DROP TABLE IF EXISTS pages;
CREATE TABLE pages (
    page_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    image_src TEXT,
    content TEXT NOT NULL
);

INSERT INTO pages (title, image_src, content) VALUES
('Firewood', 'sk-firewood.png', 'For many homesteaders, firewood is an essential resource for heating and cooking. Whether you have a wood stove, fireplace, or outdoor fire pit, having a reliable supply of firewood is crucial for survival in a homestead environment. Firewood can be used for heating, cooking, and even as a source of light. It is important to have a good understanding of the different types of firewood, how to properly store it, and how to safely use it. In this section, we will cover everything you need to know about firewood regarding selecting the right type of wood to building a fire and maintaining it throughout the winter months.'),
('Chicken', 'sk-chicken.png', 'It has been said that Chickens are the "gateway" animals to homesteading.  They provide a source of fresh eggs, meat, and fertilizer for the garden.  They are relatively easy to care for and can be kept in a small space, making them ideal for homesteaders with limited land.  Chickens can also help control pests in the garden and provide entertainment with their unique personalities.'),
('Garden', 'sk-garden.png', 'A garden is a fundamental aspect of homesteading, providing a source of fresh produce and herbs for cooking and preserving.  A well-maintained garden can also be a source of beauty and relaxation, offering a peaceful retreat from the hustle and bustle of daily life.  In this section, we will cover everything you need to know about gardening on a homestead, including soil preparation, planting techniques, pest control, and harvesting tips.  Whether you are a seasoned gardener or just starting out, this section will provide valuable information to help you create a thriving garden on your homestead.');

Select * from pages;

DROP TABLE IF EXISTS columns;
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    order_id integer,
    mouseoverText TEXT,
    dataType VARCHAR(50) NOT NULL,
    isSort BOOLEAN DEFAULT FALSE,
    isFilter BOOLEAN DEFAULT FALSE,
    isVisible BOOLEAN DEFAULT TRUE,
    category VARCHAR(255),
    styleWidth integer
);

INSERT INTO columns (name, order_id, mouseoverText, dataType, isSort, isFilter, isVisible, category, styleWidth)
('imageUrl', 1, 'Image', 'image', false, false, true, null,null),
('purpose', 2, 'Purpose', 'string', false, true, true, null,140),
('rarity', 3, 'Rarity', 'string', false, true, true, null,140),
('temperament', 4, 'Temperament', 'string', false, true, true, 'Behavior',240),
('noise', 5, 'Noise', 'string', false, true, true, 'Behavior',140),
('broody', 6, 'Broodiness', 'string', false, true, true, 'Eggs',140),
('eggColor', 7, 'Egg Color', 'string', true, true, true, 'Eggs',140),
('eggSize', 8, 'Egg Size', 'string', true, true, true, 'Eggs',140),
('eggNumber', 9, 'Egg Number', 'number', true, true, true,'Eggs' ,140),
('freeRange', 10,'Free Range','boolean' ,false,true,true,'Enviornment' ,null),
('tolerance', 11,'Tolerance','string' ,false,true,true,'Enviornment' ,null),
('heatTolerance', 12,'Heat Tolerance','boolean' ,false,true,true,'Enviornment' ,72),
('coldTolerance', 13,'Cold Tolerance','boolean' ,false,true,true,'Enviornment' ,72),
('origin', 14,'Origin','string' ,false,true,false,'Enviornment' ,140),
('weightBantam', 15,'Bantam (lb)','string' ,false,true,true,'Weight' ,null),
('weightStand', 16,'Stand (lb)','string' ,false,true,true,'Weight' ,null),
('weightMale', 17,'Male (lb)','number' ,false,true,true,'Weight' ,null),
('weightFemale', 18,'Female (lb)','number' ,false,true,true,'Weight' ,null),
('physicalVarieties', 19,'Varieties','string' ,false,true,true,'Physical' ,null),
('physicalComb', 20,'Comb','string' ,false,true,true,'Physical' ,null),
('physicalEars', 21,'Ears','string' ,false,true,true,'Physical' ,null),
('featherFeet', 22,'Feather Feet','boolean' ,false,true,true,'Physical' ,140),
('PhysicalSkin', 23,'Skin','string' ,false,true,false,'Physical' ,null),
('physicalShanks', 24,'Shanks','string' ,false,true,true,'Physical' ,null),
('physicalMaturing', 25,'Maturing','string' ,false,true,true,'Physical' ,null),
('sexlink', 26,'Sexlinked','string' ,false,true,true,'Physical' ,140),
('sources', 27,'Sources','string' ,false,false,false,null ,null);

DROP TABLE IF EXISTS page_columns;
CREATE TABLE page_columns (
    id SERIAL PRIMARY KEY,
    column_id REFERENCES columns(id) ON DELETE CASCADE,
    page_id REFERENCES pages(page_id) ON DELETE CASCADE,
);

DROP TABLE IF EXISTS page_item;
CREATE TABLE page_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    page_id REFERENCES pages(page_id) ON DELETE CASCADE,
);

INSERT INTO page_item (name, page_id) VALUES
('Alder', 1),
('Apple', 1),
('Ash', 1),
('Ash (Black)', 1),
('Ash (Green)', 1),
('Ash (White)', 1),
('Aspen', 1),
('Basswood', 1),
('Beech', 1),
('Beech (Blue)', 1),
('Birch (Black)', 1),
('Birch (Grey)', 1);
INSERT INTO page_item (name, page_id) VALUES
('Ameraucana', 2),
('Ancona', 2),
('Rhode Island Red', 2);

DROP TABLE IF EXISTS page_item_value;
CREATE TABLE page_item_value (
    id SERIAL PRIMARY KEY,
    page_item_id REFERENCES page_item(id) ON DELETE CASCADE,
    column_id REFERENCES columns(id) ON DELETE CASCADE,
    valueString VARCHAR(255),
    valueNumber DECIMAL(10, 2),
    valueNumber2 DECIMAL(10, 2),
    valueBoolean BOOLEAN,
    display VARCHAR(255) NOT NULL,
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO page_item_value (page_item_id, column_id, valueString, valueNumber, valueNumber2, valueBoolean, display, source) VALUES
(1, 1, 'sk-alder.png', null, null, null, null, null),
(1, 2, 'Firewood', null, null, null, null, null),
(1, 3, 'Common', null, null, null, null, null),
(1, 4, 'Hard', null, null, null, null, null),
(1, 5, 'Low', null, null, null, null, null),
(1, 6, null, null, null, null, null),
(1, 7, null, null, null, null, null),
(1, 8, null, null, null, null, null),
(1, 9, null, null, null, null, null),
(1, 10, null, null, true, null, null),
(1, 11, 'Full Sun', null, null, 'Full Sun', null),
(1, 12, true, null, null, 'Yes', null),
(1, 13, true, null, null, 'Yes', null),
(1, 14,'North America', null, null, 'North America', null),
(1, 15,null,null,null,null,null),
(1, 16,null,null),
(1, 17,null,null),
(1, 18,null,null),
(1, 19,'None', 'None'),
(1, 20,'None', 'None'),
(1, 21,'None', 'None'),
(1, 22,false,'No'),
(1, 23,'Rough', 'Rough'),
(1, 24,'None', 'None'),
(1, 25,'Fast', 'Fast Maturing'),
(1, 26,'No', 'No'),
(1, 27,'https://www.wood-database.com/alder/', 'Wood Database');