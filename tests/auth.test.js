import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.model.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API Tests', () => {
  it('should sign up a new user', async () => {
    const res = await request(app).post('/auth/signup')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login the user', async () => {
    const res = await request(app).post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to login with wrong password', async () => {
    const res = await request(app).post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials!');
  });
});
