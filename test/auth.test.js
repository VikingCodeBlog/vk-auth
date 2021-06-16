const supertest = require('supertest')
const { app, db, server } = require('../index')

const api = supertest(app);

beforeEach(async () => {
  await db;
});

describe("This is the test", () => {
  test('Empty data should get error', async () => {
    await api.post('/create')
      .expect(422)
      .expect('Content-Type', /application\/json/);
  })
});

afterAll(() => {
  db.close();
  server.close();
});