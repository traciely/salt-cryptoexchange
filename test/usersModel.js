let mocha = require('mocha');
let sinon = require('sinon');
let expect = require('chai').expect;
let Promise = require('bluebird');
let DB = require('../models/DB.js');
let users = require('../models/users.js');
let currencies = require('../models/currencies.js');


describe('Users Model Tests', () => {
  describe('createUser', function() {
      let params = {
      username: 'test-user',
      firstname: 'test-first',
      lastname: 'test-last'
    };

    beforeEach(function() {
      // clear out db tables;
      return Promise.using(DB.getConnection(), connection => {
        connection.query('TRUNCATE TABLE users;');
        connection.query('TRUNCATE TABLE user_currency_totals;');
      });
    });

    it('should create a new user in the users table', function() {
      return users.createUser(params)
      .then(function(userResult) {
        expect(userResult).to.deep.equal({
            id: 1,
            username: 'test-user',
            firstName: 'test-first',
            lastName: 'test-last'
          });
        return Promise.resolve();     
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
    });

  it('should return user if that user already exists', function() {
      return users.createUser(params)
      .then(function(userResult) {
        expect(userResult).to.deep.equal({
          id: 1,
          username: 'test-user',
          firstName: 'test-first',
          lastName: 'test-last'
        });
        return Promise.resolve();
      })
      .catch(function(err) {
        return Promise.reject(err);
      })
    });
  });

  describe('getUserByUsername', function() {
    before(function() {
      let params = {
        username: 'test-user2',
        firstname: 'test-first2',
        lastname: 'test-last2'
      };

      return users.createUser(params);
    });

    it('should get a user by their username', function() {
      return users.getUserByUsername('test-user2')
      .then(userResult => {
        expect(userResult).to.deep.equal({
          id: 2, 
          username: 'test-user2', 
          firstName: 'test-first2', 
          lastName: 'test-last2'
        });
      });
    });
  });

  describe('getUserById', function() {
    before(function() {
      let params = {
        username: 'test-user3',
        firstname: 'test-first3',
        lastname: 'test-last3'
      };

      return users.createUser(params);
    });

    it('should get a user by their id', function() {
      return users.getUserById(3)
      .then(userResult => {
        expect(userResult).to.deep.equal({
          id: 3, 
          username: 'test-user3', 
          firstName: 'test-first3', 
          lastName: 'test-last3'
        });
      });
    });
  });
});