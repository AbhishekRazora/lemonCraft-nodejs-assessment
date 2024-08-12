import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Asset from '../models/asset.model.js';
import User from '../models/user.model.js';

let token;
let assetId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const userRes = await request(app).post('/auth/signup')
    .send({ username: 'marketuser', email: 'marketuser@example.com', password: 'password123' });
  token = userRes.body.token;

  const assetRes = await request(app).post('/assets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Marketplace Asset',
      description: 'This is a test asset for the marketplace',
      image: 'marketplace.png',
      status: 'published'
    });
  assetId = assetRes.body.assetId;
});

afterAll(async () => {
  await Asset.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Marketplace API Tests', () => {
  it('should list an asset on the marketplace', async () => {
    const res = await request(app).put(`/marketplace/${assetId}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Asset published successfully');
  });

  it('should retrieve assets from the marketplace', async () => {
    const res = await request(app).get('/marketplace/assets');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
