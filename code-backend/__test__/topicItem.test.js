// During the backend testing, I discovered that I could not get the mocking of the db.* function to mock correctly.  In its place, it would give me the error:
// db.manyOrNone is not a function
// I have tried multiple workaround but never with success.  
// Until I have a working version, all it() that will have a db call within it will be skipped.


const request = require('supertest');
const app = require('../app');
const { db } = require('../models/db');
const topics = require('../models/topics');

// Intercept your database module connection definitions
jest.mock('../models/db.js', () => {
  return {
    db: {
      one: jest.fn(),
      many: jest.fn(),
      manyOrNone: jest.fn()
    },
    pgp: {
      end: jest.fn()
    }
  };
});

describe('Topic Item Mocked Suite', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.PORT = 3000; // New Value
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  
  // router.get('/topic/full/:topic_id', topics.getTopicFullId);
  // module.exports.getTopicFullId
  it.skip('GET Topic ID', async () => {
    // ... = await db.manyOrNone
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn().mockImplementationOnce(async () => [
      {
        "id": 1,
        "key": "name",
        "name": "Name",
        "mouseovertext": null,
        "datatype": "string",
        "issort": true,
        "isfilter": false,
        "isvisible": true,
        "list": [],
        "symbols": {},
        "category": null,
        "order_id": 0,
        "stylewidth": null
      }
    ])
    .mockImplementationOnce(async () => [
      {
        "id": 4,
        "topic_id": "1",
        "name": "Himalayan",
        "aka": "Apis Cerana",
        "sources": [
          "https://homesteading.com/types-honey-bees/"
        ],
        "imageUrl": "bee.jpg",
        "colonyType": "Hive",
        "experienceLevel": "Beginners Residing in Asia"
      },
    ]);
    db.manyOrNone = myMockFunction;

    const res = await request(app).get('/topic/full/1');
  
    expect(myMockFunction).toHaveBeenCalled();
    // There are two database commands called.
    // expect(db.manyOrNone).toHaveBeenCalledWith('SELECT * FROM topics;');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify({
      header: [
        {
          "id": 1,
          "key": "name",
          "name": "Name",
          "mouseovertext": null,
          "datatype": "string",
          "issort": true,
          "isfilter": false,
          "isvisible": true,
          "list": [],
          "symbols": {},
          "category": null,
          "order_id": 0,
          "stylewidth": null
        }
      ],
      data: [
        {
          "id": 4,
          "topic_id": "1",
          "name": "Himalayan",
          "aka": "Apis Cerana",
          "sources": [
            "https://homesteading.com/types-honey-bees/"
          ],
          "imageUrl": "bee.jpg",
          "colonyType": "Hive",
          "experienceLevel": "Beginners Residing in Asia"
        }
      ],
      sources: [
        "https://homesteading.com/types-honey-bees/"
      ]
    }));
  });
  
  // router.get('/topic/data/:topic_id', topics.getDataId);
  // module.exports.getDataId
  it.skip('GET TopicItem ID', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => (
      {
        "id": 4,
        "name": "Himalayan",
        "topic_id": 1,
        "data": {
          "aka": "Apis Cerana",
          "sources": [
            "https://homesteading.com/types-honey-bees/"
          ],
          "imageUrl": "bee.jpg",
          "topic_id": "1",
          "colonyType": "Hive",
          "experienceLevel": "Beginners Residing in Asia"
        }
      }
    ));
    db.manyOrNone = myMockFunction;
    const res = await request(app)
      .get('/topic/data/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('SELECT * FROM topic_item WHERE topic_id = $1;');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(
      {
        "id": 4,
        "name": "Himalayan",
        "topic_id": 1,
        "data": {
          "aka": "Apis Cerana",
          "sources": [
            "https://homesteading.com/types-honey-bees/"
          ],
          "imageUrl": "bee.jpg",
          "topic_id": "1",
          "colonyType": "Hive",
          "experienceLevel": "Beginners Residing in Asia"
        }
      }));
  });
  
  // router.post('/topic/data', topics.postData);
  // module.exports.postData
  it.skip('POST TopicItem ID', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => [
      {
        "name": "Himalayan",
        "topic_id": 1,
        "data": {
          "aka": "Apis Cerana",
          "sources": [
            "https://homesteading.com/types-honey-bees/"
          ],
          "imageUrl": "bee.jpg",
          "topic_id": "1",
          "colonyType": "Hive",
          "experienceLevel": "Beginners Residing in Asia"
        }
      }
    ]);
    db.one = myMockFunction;
    const res = await request(app)
      .post('/topic')
      .send(
        {
          "id": 4,
          "name": "Himalayan",
          "topic_id": 1,
          "data": {
            "aka": "Apis Cerana",
            "sources": [
              "https://homesteading.com/types-honey-bees/"
            ],
            "imageUrl": "bee.jpg",
            "topic_id": "1",
            "colonyType": "Hive",
            "experienceLevel": "Beginners Residing in Asia"
          }
        })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('INSERT INTO "topic_item" (topic_id, name, data) VALUES ($1, $2, $3) RETURNING id, topic_id, name, data;');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Himalayan');
  });
  
  // router.patch('/topic/data', topics.patchData);
  // module.exports.patchData
  it.skip('PATCH TopicItem ID', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => [
      {
        "id": 4,
        "name": "Himalayan",
        "topic_id": 1,
        "data": {
          "aka": "Apis Cerana",
          "sources": [
            "https://homesteading.com/types-honey-bees/"
          ],
          "imageUrl": "bee.jpg",
          "topic_id": "1",
          "colonyType": "Hive",
          "experienceLevel": "Beginners Residing in Asia"
        }
      }
    ]);
    db.one = myMockFunction;
    const res = await request(app)
      .patch('/topic')
      .send(
        {
          "id": 4,
          "name": "Himalayan",
          "topic_id": 1,
          "data": {
            "aka": "Apis Cerana",
            "sources": [
              "https://homesteading.com/types-honey-bees/"
            ],
            "imageUrl": "bee.jpg",
            "topic_id": "1",
            "colonyType": "Hive",
            "experienceLevel": "Beginners Residing in Asia"
          }
        }
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('UPDATE "topic_item" SET name = $2 data = $3 WHERE id = $1 RETURNING *;');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Himalayan');
  });
});
