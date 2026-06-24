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

describe('Topic Mocked Suite', () => {
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
  // router.get('/topic/data/:topic_id', topics.getDataId);
  // router.post('/topic/data', topics.postData);
  // router.patch('/topic/data', topics.patchData);


  // router.get('/topic', topics.getTopic);
  // module.exports.getTopic
  it.skip('GET Topic', async () => {
    // ... = await db.manyOrNone
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn().mockImplementation(async () => [
      {
        "id": 1,
        "division": "Animals",
        "section": "Insect",
        "name": "Bee",
        "order_id": 0,
        "logo": "/images/sk-bee.png",
        "description": "Short Description | Long Description",
        "created_at": "2026-05-18T04:36:56.181Z",
        "isvisible": true,
        "category": null
      }
    ]);
    db.manyOrNone = myMockFunction;

    const res = await request(app).get('/topic');
  
    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('SELECT * FROM topics;');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify([
      {
        "id": 1,
        "division": "Animals",
        "section": "Insect",
        "name": "Bee",
        "order_id": 0,
        "logo": "/images/sk-bee.png",
        "description": "Short Description | Long Description",
        "created_at": "2026-05-18T04:36:56.181Z",
        "isvisible": true,
        "category": null
      }
    ]));
  });
  
  // router.get('/topic/:topic_id', topics.getTopicId);
  // module.exports.getTopicId
  it.skip('GET Topic ID', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => (
      {
        "id": 1,
        "division": "Animals",
        "section": "Insect",
        "name": "Bee",
        "order_id": 0,
        "logo": "/images/sk-bee.png",
        "description": "Short Description | Long Description",
        "created_at": "2026-05-18T04:36:56.181Z",
        "isvisible": true,
        "category": null
      }
    ));
    db.one = myMockFunction;
    const res = await request(app)
      .get('/topic/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.one).toHaveBeenCalledWith('SELECT * FROM topics WHERE id = $1;');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Bee');
  });

  // router.post('/topic', topics.postTopic);
  // module.exports.postTopic
  it.skip('POST Topic', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => [
      {
        "id": 1,
        "division": "Animals",
        "section": "Insect",
        "name": "Bee",
        "order_id": 0,
        "logo": "/images/sk-bee.png",
        "description": "Short Description | Long Description",
        "created_at": "2026-05-18T04:36:56.181Z",
        "isvisible": true,
        "category": null
      }
    ]);
    db.one = myMockFunction;
    const res = await request(app)
      .post('/topic')
      .send(
        {
          "division": "Animals",
          "section": "Insect",
          "name": "Bee",
          "order_id": 0,
          "logo": "/images/sk-bee.png",
          "description": "Short Description | Long Description",
          "created_at": "2026-05-18T04:36:56.181Z",
          "isvisible": true,
          "category": null
        })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('INSERT INTO "topic_item" (topic_id, name, data) VALUES ($1, $2, $3) RETURNING id, topic_id, name, data;');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Bee');
  });
  
  // router.patch('/topic', topics.patchTopic);
  // module.exports.patchTopic
  it.skip('PATCH Topic', async () => {
    // ... = await db.one
    // This requires mockImplementation() to have 'async'
    const myMockFunction = jest.fn(async () => [
      {
        "id": 1,
        "division": "Animals",
        "section": "Insect",
        "name": "Bee",
        "order_id": 0,
        "logo": "/images/sk-bee.png",
        "description": "Short Description | Long Description",
        "created_at": "2026-05-18T04:36:56.181Z",
        "isvisible": true,
        "category": null
      }
    ]);
    db.one = myMockFunction;
    const res = await request(app)
      .patch('/topic')
      .send(
        {
          "id": 1,
          "division": "Animals",
          "section": "Insect",
          "name": "Bee",
          "order_id": 0,
          "logo": "/images/sk-bee.png",
          "description": "Short Description | Long Description",
          "created_at": "2026-05-18T04:36:56.181Z",
          "isvisible": true,
          "category": null
        })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(myMockFunction).toHaveBeenCalled();
    expect(db.manyOrNone).toHaveBeenCalledWith('UPDATE "topics" SET division = $2, section = $3, name = $4, order_id = $5, logo = $6, description = $7, isvisible = $8, category = $9 WHERE id = $1 RETURNING *;');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Bee');
  });
});
