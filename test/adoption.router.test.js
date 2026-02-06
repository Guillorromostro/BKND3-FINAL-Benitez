const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/lib/db');

const User = require('../src/models/User');
const Pet = require('../src/models/Pet');

async function resetDb() {
  await mongoose.connection.db.dropDatabase();
}

describe('adoption.router.js functional tests', function () {
  before(async function () {
    await connectDB();
  });

  after(async function () {
    await disconnectDB();
  });

  beforeEach(async function () {
    await resetDb();
  });

  it('GET /api/adoptions should return empty array initially', async function () {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('array').that.has.length(0);
  });

  it('POST /api/adoptions should fail with 400 when body is missing', async function () {
    const res = await request(app).post('/api/adoptions').send({});
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('POST /api/adoptions should fail with 400 for invalid userId/petId', async function () {
    const res = await request(app).post('/api/adoptions').send({ userId: 'bad', petId: 'also-bad' });
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('POST /api/adoptions should fail with 404 when user does not exist', async function () {
    const pet = await Pet.create({ name: 'Fido', species: 'dog', color: 'brown' });
    const res = await request(app)
      .post('/api/adoptions')
      .send({ userId: new mongoose.Types.ObjectId().toString(), petId: pet._id.toString() });

    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
    expect(res.body.error).to.match(/User not found/i);
  });

  it('POST /api/adoptions should fail with 404 when pet does not exist', async function () {
    const user = await User.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'hashed', role: 'user' });
    const res = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: new mongoose.Types.ObjectId().toString() });

    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
    expect(res.body.error).to.match(/Pet not found/i);
  });

  it('POST /api/adoptions should create adoption (201)', async function () {
    const user = await User.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'hashed', role: 'user' });
    const pet = await Pet.create({ name: 'Fido', species: 'dog', color: 'brown' });

    const res = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: pet._id.toString() });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.have.property('_id');
    expect(res.body.payload).to.have.property('user', user._id.toString());
    expect(res.body.payload).to.have.property('pet', pet._id.toString());
    expect(res.body.payload).to.have.property('status', 'pending');
  });

  it('GET /api/adoptions/:id should fail with 400 for invalid id', async function () {
    const res = await request(app).get('/api/adoptions/not-an-id');
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('GET /api/adoptions/:id should fail with 404 for non-existing id', async function () {
    const res = await request(app).get(`/api/adoptions/${new mongoose.Types.ObjectId().toString()}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('GET /api/adoptions/:id should return adoption (200)', async function () {
    const user = await User.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'hashed', role: 'user' });
    const pet = await Pet.create({ name: 'Fido', species: 'dog', color: 'brown' });

    const createRes = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: pet._id.toString() });

    const id = createRes.body.payload._id;
    const res = await request(app).get(`/api/adoptions/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload._id).to.equal(id);
  });

  it('PUT /api/adoptions/:id should fail with 400 for invalid id', async function () {
    const res = await request(app).put('/api/adoptions/invalid').send({ status: 'approved' });
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('PUT /api/adoptions/:id should fail with 404 for non-existing id', async function () {
    const res = await request(app)
      .put(`/api/adoptions/${new mongoose.Types.ObjectId().toString()}`)
      .send({ status: 'approved' });

    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('PUT /api/adoptions/:id should update status (200)', async function () {
    const user = await User.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'hashed', role: 'user' });
    const pet = await Pet.create({ name: 'Fido', species: 'dog', color: 'brown' });

    const createRes = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: pet._id.toString() });

    const id = createRes.body.payload._id;
    const res = await request(app)
      .put(`/api/adoptions/${id}`)
      .send({ status: 'approved' });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.have.property('_id', id);
    expect(res.body.payload).to.have.property('status', 'approved');
  });

  it('DELETE /api/adoptions/:id should fail with 400 for invalid id', async function () {
    const res = await request(app).delete('/api/adoptions/invalid');
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('DELETE /api/adoptions/:id should fail with 404 for non-existing id', async function () {
    const res = await request(app).delete(`/api/adoptions/${new mongoose.Types.ObjectId().toString()}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('DELETE /api/adoptions/:id should delete adoption (200) and then 404 on GET', async function () {
    const user = await User.create({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'hashed', role: 'user' });
    const pet = await Pet.create({ name: 'Fido', species: 'dog', color: 'brown' });

    const createRes = await request(app)
      .post('/api/adoptions')
      .send({ userId: user._id.toString(), petId: pet._id.toString() });

    const id = createRes.body.payload._id;

    const delRes = await request(app).delete(`/api/adoptions/${id}`);
    expect(delRes.status).to.equal(200);
    expect(delRes.body.status).to.equal('success');

    const getRes = await request(app).get(`/api/adoptions/${id}`);
    expect(getRes.status).to.equal(404);
  });
});
