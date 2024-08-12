import request from 'supertest';
import mongoose from 'mongoose';
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
    .send({ username: 'requestuser', email: 'requestuser@example.com', password: 'password123' });
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

afterAll(async () => {
  await Asset.deleteMany({});
  await User.deleteMany({});
  await Request.deleteMany({});
  await mongoose.connection.close();
});

describe('Request API Tests', () => {
//   it('should create a purchase request', async () => {
//     const res = await request(app).post(`/requests/${assetId}/request`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ proposedPrice: 500 });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body.message).toEqual('Purchase request sent');
//     requestId = res.body.requestId;
//   });

  it('should negotiate a purchase request', async () => {
    const res = await request(app).put(`/requests/${requestId}/negotiate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newProposedPrice: 600 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Negotiation updated');
  });

  it('should accept a purchase request', async () => {
    const res = await request(app).put(`/requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Request accepted, holder updated');
  });

  it('should deny a purchase request', async () => {
    const newRequestRes = await request(app).post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 700 });
    const newRequestId = newRequestRes.body.requestId;

    const res = await request(app).put(`/requests/${newRequestId}/deny`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Request denied');
  });

  it('should retrieve user requests', async () => {
    const res = await request(app).get('/requests/user/requests')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
