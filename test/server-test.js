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


})
