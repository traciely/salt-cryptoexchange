let mocha = require('mocha');
let sinon = require('sinon');
let expect = require('chai').expect;
// let mock = sinon.mock(require('../models/DB.js'));
let currencies = require('../models/currencies.js');

describe('Currencies Model Tests', function() {
  describe('getCurrencies', function() {
    it('should return back an array of all currencies',function() {
      let results = [
        {
          id: 1,
          fsym: 'USD'
        },
        {
          id: 2,
          fsym: 'BTC'
        },
        {
          id: 3,
          fsym: 'LCT'
        },
        {
          id: 4,
          fsym: 'DOGE'
        },
        {
          id: 5,
          fsym: 'XMR'
        }
      ];

      return currencies.getCurrencies()
      .then(currencyResults => {
        return expect(currencyResults).to.have.deep.members(results);
      })
      .catch(function(err) {
        return Promise.reject();
      });
    });
  });
});