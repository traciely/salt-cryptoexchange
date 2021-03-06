let Promise = require('bluebird');
let mocha = require("mocha");
let chai = require("chai");
chai.use(require("chai-http"));
let expect = chai.expect;
let sinon = require('sinon');

let app = require('../app.js');
let usersModel = require('../models/users.js');

describe("User Controller Tests", function() {
  describe("/GET user (getUser)", function() {
    it('should return a 404 if no username exists with that name', function() {
      return chai.request(app)
      .get('/users/test-user12345')
      .then(function(res) {
        return expect(res).to.have.status(404);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });

    it('should return data if a user exists', function() {
      return chai.request(app)
      .get('/users/test-user')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          id: 1,
          username: 'test-user',
          firstName: 'test-first',
          lastName: 'test-last'
        });
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });
  });

  describe("/POST user (createUser)", function() {
    let postBody;
    let usersModelStub;
    before(function() {
      usersModelStub = sinon.stub(usersModel, 'createUser')
      .resolves({
        id: 1,
        username: 'test-user',
        firstName: 'test-first',
        lastName: 'test-last'
      });
    });

    beforeEach(function() {
      postBody = {
        username: 'test-user',
        firstname: 'test-first',
        lastname: 'test-last'
      };
    });

    after(function() {
      usersModelStub.restore();
    });

    it("should return a 400 if no username passed in", function() {
      delete postBody.username;
      return chai.request(app)
      .post('/users')
      .type('form')
      .send(postBody)
      .then(function(res) {
        return expect(res).to.have.status(400);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });
    it("should return a 400 if no first name is passed in", function() {
      delete postBody.firstname;
      return chai.request(app)
      .post('/users')
      .type('form')
      .send(postBody)
      .then(function(res) {
        return expect(res).to.have.status(400);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });
    it("should return a 400 if no last name is passed in", function() {
      delete postBody.lastname;
      return chai.request(app)
      .post('/users')
      .type('form')
      .send(postBody)
      .then(function(res) {
        return expect(res).to.have.status(400);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });

    it("should return a 201 if a new user is created", function() {
      return chai.request(app)
      .post('/users')
      .type('form')
      .send(postBody)
      .then(function(res) {
        return expect(res).to.have.status(201);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    })
  });
});