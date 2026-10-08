require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test_secret';
const app = require('../app.js');

const assertTestDb = () => {
  const name = mongoose.connection.name || '';
  if (!name.endsWith('_test')) {
    throw new Error(`Refusing to run: connected to "${name}", not a *_test database`);
  }
};

beforeAll(async () => {
  if (!process.env.TEST_MONGO_URL) {
    throw new Error('TEST_MONGO_URL is not set');
  }
  await mongoose.connect(process.env.TEST_MONGO_URL);
  assertTestDb();
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  assertTestDb();
  await mongoose.connection.db.dropDatabase();
});

describe('Auth routes', () => {
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  test('signup creates a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('User created');
  });

  test('signup rejects a duplicate username or email', async () => {
    await request(app).post('/api/auth/signup').send(user);
    const res = await request(app).post('/api/auth/signup').send(user);
    expect(res.statusCode).toBe(400);
  });

  test('login returns a token for correct credentials', async () => {
    await request(app).post('/api/auth/signup').send(user);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login rejects a wrong password', async () => {
    await request(app).post('/api/auth/signup').send(user);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: user.username, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('login rejects an unknown user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'whatever' });
    expect(res.statusCode).toBe(400);
  });
});