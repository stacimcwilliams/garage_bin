process.env.NODE_ENV = 'test';

const environment = 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

describe('Server testing', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => {
      database.seed.run()
      .then(() => {
        done()
      })
    })
  })

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done()
    })
  })

  describe('GET /api/v1/stuff', () => {
    it('should retreive all the stuff', (done) => {
      chai.request(server)
      .get('/api/v1/stuff')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.should.have.length(5)
        response.body[0].should.have.property('name')
        response.body[0].should.have.property('reason')
        response.body[0].should.have.property('cleanliness')
        done()
      })
    })
  })

  describe('GET /api/v1/stuff/:id', () => {
    it('should retreive one thing by id', (done) => {
      chai.request(server)
      .get('/api/v1/stuff/2')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.should.have.length(1)
        response.body[0].should.have.property('name')
        response.body[0].should.have.property('reason')
        response.body[0].should.have.property('cleanliness')
        done()
      })
    })
  })

  describe('POST /api/v1/stuff/', () => {
    it('should create a new item for the garage_bin', (done) => {
      chai.request(server)
      .post('/api/v1/stuff')
      .send({
        id: '6',
        name: 'test',
        reason: 'because',
        cleanliness: 'rancid'
      })
      .end((error, response) => {
        response.should.have.status(200)
        response.body.should.be.a('object')
        response.body.should.have.property('name')
        response.body.should.have.property('reason')
        response.body.should.have.property('cleanliness')

        chai.request(server)
        .get('/api/v1/stuff')
        .end((err, response) => {
          response.should.have.status(200)
          response.body.should.have.length(6)
          response.should.be.json
          response.body.should.be.a('array')
          done()
        })
      })
    })
  })

  describe('PUT /api/v1/stuff/:id/edit', () => {
    it('should be able to edit the cleanliness of an item', (done) => {
      chai.request(server)
      .get('/api/v1/stuff/2')
      .end((error, response) => {
        response.body[0].cleanliness.should.equal('sparkling')
      })
      chai.request(server)
      .put('/api/v1/stuff/2/edit')
      .send({
        cleanliness: 'dusty'
      })
      .end((error, response) => {
        response.body[0].cleanliness.should.equal('dusty')
        done()
      })
    })
  })

  describe('Sad path /api/v1/stuff',() => {
    it('SAD /api/v1/items', (done) => {
      chai.request(server)
      .post('/api/v1/stuff')
      .send({
        name: 'test',
        id: 2
      })
      .end((err, response) => {
        response.should.have.status(422);
        done();
      });
    });

  })

});
