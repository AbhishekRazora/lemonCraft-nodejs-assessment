import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import app from '../app.js';
import Asset from '../models/asset.model.js';
import User from '../models/user.model.js';
import Request from '../models/request.model.js';

let token;
let assetId;
let requestId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const userRes = await request(app).post('/auth/signup')
    .send({ username: 'assetuser', email: 'assetuser@example.com', password: 'password123' });
  token = userRes.body.token;

  const assetRes = await request(app).post('/assets')
  .set('Authorization', `Bearer ${token}`)
  .send({
    name: 'Request Asset',
    description: 'This is a test asset for requests',
    image: 'request.png',
    status: 'published'
  });
assetId = assetRes.body.assetId;
});
// });

afterAll(async () => {
  await Asset.deleteMany({});
  await User.deleteMany({});
  await Request.deleteMany({});
  await mongoose.connection.close();
});

describe('Asset API Tests', () => {
  it('should create a new asset', async () => {
    const res = await request(app).post('/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Sample Asset',
        description: 'This is a test asset',
        image: 'sample.png',
        status: 'published'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('assetId');
    assetId = res.body.assetId;
  });

  it('should update an existing asset', async () => {
    const res = await request(app).post(`/assets/${assetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Asset',
        description: 'This is an updated test asset',
        image: 'updated.png',
        status: 'published'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.assetId).toEqual(assetId);
  });

  it('should retrieve the asset details', async () => {
    const res = await request(app).get(`/assets/${assetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated Asset');
  });

  it('should retrieve user assets', async () => {
    const res = await request(app).get(`/assets/user/${assetId}/assets`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a purchase request', async () => {
    const res = await request(app).post(`/assets/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 500 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Purchase request sent');
    requestId = res.body.requestId;
  });
  it('should list an asset on the marketplace', async () => {
    const res = await request(app).put(`/assets/${assetId}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Asset published successfully');
  });
});
