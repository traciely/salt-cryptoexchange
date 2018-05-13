let mocha = require('mocha');
let sinon = require('sinon');
let expect = require('chai').expect;
// let mock = sinon.mock(require('../models/DB.js'));
let currencies = require('../models/currencies.js');

describe('Currencies Model Tests', () => {
  describe('getCurrencies', () => {
    it('should return back an array of all currencies',() => {
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
          fsym: 'LTC'
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

      currencies.getCurrencies()
      .then(currencyResults => {
        expect(results).to.have.deep.members(currencyResults);
      });
    });
  });
});