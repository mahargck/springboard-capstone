DROP TABLE IF EXISTS topics;
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    division VARCHAR(255) NOT NULL,
    section VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    order_id INTEGER,
    isvisible BOOLEAN DEFAULT TRUE,
    logo VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_topic UNIQUE (name)
);
GRANT ALL PRIVILEGES ON topics TO web;

INSERT INTO topics
(division, section, name, order_id, logo, description, isvisible, category)
VALUES
( 'Animals', 'Insect', 'Bee', 0, '/images/sk-bee.png', 'Adding honey bees to a homestead dramatically improves garden yields and ecological diversity, while providing a sustainable supply of honey and beeswax. | Successful beekeeping requires an upfront financial investment of about $200+ for a hive and $150+ for bees, along with routine management during the warmer months.', true, null ),
( 'Animals', 'Poultry', 'Quail', 1, '/images/sk-quail.png', 'Raising homestead quail is an excellent way to produce quick, high-quality protein (meat and eggs) in a small space. | The most popular homestead breed is the Coturnix quail, which matures for meat in just 6 to 8 weeks and begins laying nutrient-dense eggs at roughly 6 weeks of age.', false, null ),
( 'Animals', 'Poultry', 'Chicken', 2, '/images/sk-chicken.png', 'Raising homestead chickens is a rewarding, sustainable way to produce your own meat and eggs. | For our family, success relies on choosing the right dual-purpose breeds, designing a secure coop to protect them from Pacific Northwest predators, and managing their pasture grazing.', true, 'Eggs' ),
( 'Animals', 'Poultry', 'Duck', 3, '/images/sk-duck.png', 'Raising homestead ducks is an excellent way to secure consistent egg production, cultivate natural pest control, and produce high-quality meat. They are hardy, weather-tolerant, and require simpler housing than chickens. They do require a source of water and are MESSY!', true, null ),
( 'Animals', 'Poultry', 'Geese', 4, null, 'Geese are waterfowl that are commonly raised for their meat and eggs. Geese are also used to protect livestock, esp chickens from hawks and other predators. ', true, null ),
( 'Animals', 'Poultry', 'Turkey', 5, '/images/sk-turkey.png', 'Raising turkeys on a homestead is a rewarding endeavor that provides sustainable, high-quality meat or eggs, but it requires diligent management.', true, null ),
( 'Animals', 'Small Livestock', 'Rabbit', 6, '/images/sk-rabbit.png', 'Rabbits are small mammals that are commonly raised for their meat and fur.', false, null ),
( 'Animals', 'Large Livestock', 'Goat', 7, '/images/sk-goat.png', 'Goats are domesticated animals commonly raised for their milk, meat, and hides.', false, null ),
( 'Animals', 'Large Livestock', 'Sheep', 8, '/images/sk-sheep.png', 'Sheep are versatile, low-input homestead animals perfect for producing meat, milk, and wool on small acreage. | They are highly efficient grass-to-meat converters that naturally fertilize pastures. Because they are flock animals, you should start with a minimum of two, though four ewes can comfortably graze on just a half-acre to an acre of land.', true, null ),
( 'Animals', 'Large Livestock', 'Pig', 9, '/images/sk-pig.png', 'Raising pigs on a homestead is a rewarding way to manage food waste, clear land, and produce high-quality meat. | Beginners typically purchase 2-3 weaned piglets in the spring, raise them on pasture and farm scraps for 5–7 months, and process in the fall.', true, null ),
( 'Animals', 'Large Livestock', 'Cow', 10, '/images/sk-cow.png', 'Cows are domesticated animals commonly raised for milk, meat, and hides.', false, null ),
( 'Animals', 'Large Livestock', 'Horse', 11, null, 'Text', false, null ),
( 'Animals', 'Guardian', 'Dog', 12, '/images/sk-dog.png', 'Homestead dogs are essential working partners tailored to the property’s needs. Select breeds based on the specific job required—guarding livestock from predators, herding, guarding humans, or managing pests. The ideal dog balances assertiveness with loyalty, and suits the specific climate and wildlife challenges.', false, null ),
( 'Plants', 'Trees', 'Firewood', 1, '/images/sk-firewood.png', 'For many homesteaders, firewood is an essential resource for heating and cooking. Whether you have a wood stove, fireplace, or outdoor fire pit, having a reliable supply of firewood is crucial for survival in a homestead environment.| Firewood can be used for heating, cooking, and even as a source of light. It is important to have a good understanding of the different types of firewood, how to properly store it, and how to safely use it. In this section, we will cover everything you need to know about firewood: selecting the right type of wood, building a fire, maintaining it throughout the winter months.', true, null ),
( 'Plants', 'Sort Term', 'Flowers', 1, '/images/sk-flower.png', 'Flowers give beauty, while serving unique purposes for the homestead. Flowers offer pest resistance to the garden, bring pollinators to the garden, and provide food to humans and livestock. ', false, null ),
( 'Plants', 'Sort Term', 'Roots', 2, '/images/sk-root.png', 'Text', false, null ),
( 'Plants', 'Sort Term', 'Vines', 4, '/images/sk-vine.png', 'Text', false, null ),
( 'Plants', 'Long Term', 'Trees', 3, '/images/sk-tree.png', 'Text', false, 'Wood' ),
( 'Animals', 'Wildlife', 'Predators', 99, null, 'Uncontrollable, these can be the bane of your homestead.', false, null );

Select * from topics;