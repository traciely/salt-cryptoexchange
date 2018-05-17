let mocha = require('mocha');
let sinon = require('sinon');
let expect = require('chai').expect;
// let mock = sinon.mock(require('../models/DB.js'));
let currencies = require('../models/currencies.js');

describe('Currencies Model Tests', function() {
  describe('getCurrencies', function() {
    it('should return back an object which contains all currencies',function() {
      let results = {
        USD: {
          id: 1,
          fsym: 'USD'
        },
        BTC: {
          id: 2,
          fsym: 'BTC'
        },
        LCT: {
          id: 3,
          fsym: 'LCT'
        },
        DOGE: {
          id: 4,
          fsym: 'DOGE'
        },
        XMR: {
          id: 5,
          fsym: 'XMR'
        }
      };

      return currencies.getCurrencies()
      .then(currencyResults => {
        return expect(currencyResults).to.have.deep.equal(results);
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
    });
  });
});