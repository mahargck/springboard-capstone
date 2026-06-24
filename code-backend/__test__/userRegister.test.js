const request = require('supertest');
const app = require('../app');
const { db } = require('../models/db');

// Intercept your database module connection definitions
jest.mock('../models/db.js', () => {
  return {
    db: {
      one: jest.fn(),
      many: jest.fn(),
      manyOrNone: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
    },
    pgp: {
      end: jest.fn()
    }
  };
});

describe('/columns/ Mocked Suite', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });
  afterAll(() => {
    console.error = originalError; // Restore original console
  });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.mock('../models/db.js', () => {
      return {
        db: {
          one: jest.fn(),
          many: jest.fn(),
          manyOrNone: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }])
        },
        pgp: {
          end: jest.fn()
        }
      };
    });
    // jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.PORT = 3000; // New Value
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('POST userRegister, No Data', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({
      error: ['Please provide a valid email', 'Password must be at least 6 characters']
    }));
  })

  it('POST userRegister, Bad email, no Password', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({email: "1234"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({
      error: ['Please provide a valid email', 'Password must be at least 6 characters']
    }))
  })

  it('POST userRegister, Good email, no Password', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({email: "1234@email.com"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({
      error: ['Password must be at least 6 characters']
    }))
  })

  it('POST userRegister, Bad email, good Password', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({email: "1234", password: '123456'})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({
      error: ['Please provide a valid email']
    }))
  })
})
