let mocha = require('mocha');
let expect = require('chai').expect;
let orders = require('../models/orders.js');

describe('Orders Model Tests', function() {
  describe('getOrdersByUserId', function() {
    it('should return back an empty array if user has no orders', function() {
      return orders.getOrdersByUserId(1)
      .then(ordersResults => {
        return expect(ordersResults).to.deep.equal([]);
      });
    });
  });
});