const supertest = require('supertest');
const { app, db, server } = require('../index');

const api = supertest(app);

let newUser;

beforeEach(async () => {
  await db;
  newUser = {
    name: 'SuperTestUser',
    surname: 'SuperTestUser Surname',
    password: Math.random().toString(36).slice(2),
    email: `supertest${Date.now()}@gmail.com`,
    nikName: 'Odin',
    telf: '66666666',
  };
});

describe('Create user', () => {
  test('Should return an error due to the empty data', async () => {
    await api
      .post('/user/create')
      .expect(422)
      .expect('Content-Type', /application\/json/);
  });

  test('Should return an error required data [email]', async () => {
    delete newUser.email;
    await api
      .post('/user/create')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/);
  });

  test('Should return an error required data [name]', async () => {
    delete newUser.name;
    await api
      .post('/user/create')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/);
  });

  test('Should return an error required data [surname]', async () => {
    delete newUser.surname;
    await api
      .post('/user/create')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/);
  });

  test('Should return an error required data [password]', async () => {
    delete newUser.password;
    await api
      .post('/user/create')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/);
  });

  test('Should create user and return created user with user data', async () => {
    const { body } = await api.post('/user/create').send(newUser).expect(200);

    const bodyProperties = Object.keys(body);
    expect(bodyProperties).toContain('_id');
    expect(bodyProperties).toContain('name');
    expect(bodyProperties).toContain('surname');
    expect(bodyProperties).toContain('data');

    const bodyDataProperties = Object.keys(body.data);
    expect(bodyDataProperties).toContain('user');
    expect(bodyDataProperties).toContain('telf');
    expect(bodyDataProperties).toContain('email');
    expect(bodyDataProperties).toContain('lastConnection');
  });
});

describe('Authenticate user', () => {
  test('Should authenticate', async () => {
    await api.post('/user/create').send(newUser).expect(200);
    const { body } = await api
      .post('/auth/login/local')
      .send({ email: newUser.email, password: newUser.password })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    const bodyProperties = Object.keys(body);
    expect(bodyProperties).toContain('mensaje');
    expect(bodyProperties).toContain('token');
  });

  test('Should return error, user does not exist', async () => {
    await api
      .post('/auth/login/local')
      .send({ email: newUser.email, password: newUser.password })
      .expect('Content-Type', /application\/json/)
      .expect(401);
  });

  test('Should return error, incorrect password', async () => {
    await api.post('/user/create').send(newUser).expect(200);
    await api
      .post('/auth/login/local')
      .send({ email: newUser.email, password: `${newUser.password}extra` })
      .expect('Content-Type', /application\/json/)
      .expect(401);
  });
});

describe('Check Auth', () => {
  test('Should be a incorrect token', async () => {
    await api
      .get('/auth/check-token')
      .set({ 'access-token': 'test incorrect token' })
      .expect(401);
  });

  test('Should be a correct token', async () => {
    await api.post('/user/create').send(newUser).expect(200);
    const { body } = await api
      .post('/auth/login/local')
      .send({ email: newUser.email, password: newUser.password })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    await api
      .get('/auth/check-token')
      .set({ 'access-token': body.token })
      .expect(200);
  });
});

afterAll(() => {
  db.close();
  server.close();
});
