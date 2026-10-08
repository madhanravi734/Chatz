require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';
const app = require('../app.js');
const Room = require('../models/Room.js');
const Message = require('../models/Message.js');

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

const registerAndLogin = async (username = 'testuser') => {
  const creds = {
    username,
    email: `${username}@example.com`,
    password: 'password123',
  };
  await request(app).post('/api/auth/signup').send(creds);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username, password: creds.password });
  const token = res.body.token;
  const userId = jwt.decode(token).user.id;
  return { token, userId };
};

describe('Room routes', () => {
  test('create room rejects a request with no token', async () => {
    const res = await request(app)
      .post('/api/rooms/create')
      .send({ name: 'General' });
    expect(res.statusCode).toBe(401);
  });

  test('create room saves the room with the logged-in user as creator', async () => {
    const { token, userId } = await registerAndLogin();
    const res = await request(app)
      .post('/api/rooms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'General' });
    expect(res.statusCode).toBe(201);

    const room = await Room.findOne({ name: 'General' });
    expect(room).not.toBeNull();
    expect(room.createdby.toString()).toBe(userId);
  });

  test('list rooms rejects a request with no token', async () => {
    const res = await request(app).get('/api/rooms/list');
    expect(res.statusCode).toBe(401);
  });

  test('list rooms returns every room', async () => {
    const { token, userId } = await registerAndLogin();
    await Room.create({ name: 'General', createdby: userId });
    await Room.create({ name: 'Gaming', createdby: userId });

    const res = await request(app)
      .get('/api/rooms/list')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.rooms).toHaveLength(2);
  });
});

describe('Message routes', () => {
  test('history rejects a request with no token', async () => {
    const fakeRoomId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/messages/${fakeRoomId}`);
    expect(res.statusCode).toBe(401);
  });

  test('history returns messages oldest first with the sender username', async () => {
    const { token, userId } = await registerAndLogin();
    const room = await Room.create({ name: 'General', createdby: userId });
    await Message.create({ chat: 'first', sentby: userId, room: room._id });
    await Message.create({ chat: 'second', sentby: userId, room: room._id });

    const res = await request(app)
      .get(`/api/messages/${room._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.messages.map((m) => m.chat)).toEqual(['first', 'second']);
    expect(res.body.messages[0].sentby.username).toBe('testuser');
  });

  test('history only returns messages from the requested room', async () => {
    const { token, userId } = await registerAndLogin();
    const roomA = await Room.create({ name: 'A', createdby: userId });
    const roomB = await Room.create({ name: 'B', createdby: userId });
    await Message.create({ chat: 'in A', sentby: userId, room: roomA._id });
    await Message.create({ chat: 'in B', sentby: userId, room: roomB._id });

    const res = await request(app)
      .get(`/api/messages/${roomA._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0].chat).toBe('in A');
  });
});