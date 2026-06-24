const request = require('supertest');
const app = require('../app');

describe('/zip_code/ Mocked Suite', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.PORT = 3000; // New Value
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('return valid', async () => {
    const res = await request(app).get('/zip_code/12345');

    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify({
      "zip_code":12345,
      "latitude":42.833261,
      "longitude":-74.058015,
      "city":"Schenectady",
      "state":"NY",
      "county":"Schenectady",
      // "zone":"6a",
      // "temperature_range":"-10 to -5"
    }))
  });

  it('return error', async () => {
    const res = await request(app).get('/zip_code/00000');

    expect(res.statusCode).toBe(404);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify({"error":"Zip code not found"}))
  });
});
