let mocha = require('mocha');
let sinon = require('sinon');
let expect = require('chai').expect;
let Promise = require('bluebird');
let usersModel = require('../models/users.js');
let pricesModel = require('../models/prices.js');
let portfolioModel = require('../models/portfolio.js');

describe('Portfolio Model Tests', function() {
  describe('getPortfolioByUserId', function() {
    let pricesModelStub;
    let userInfo;

    before(function () {
      let params = {
        username: 'test-user',
        firstname: 'test-first',
        lastname: 'test-last'
      };

      pricesModelStub = sinon.stub(pricesModel, 'getCurrentPrices')
      .resolves({
        USD: {
          USD: 1,
          BTC: 0.0001157
        },
        BTC: {
          USD: 8640.88,
          BTC: 1
        },
        LCT: {
          USD: 0.7,
          BTC: 0.00008137
        },
        DOGE: {
          USD: 0.00448,
          BTC: 5.1e-7
        },
        XMR: {
          USD: 205.22,
          BTC: 0.02376
        }
      });
    });

    after(function() {
      pricesModelStub.restore();
    });

    it("should return a json object for a user", function() {
      return portfolioModel.getPortfolioByUserId(1)
      .then(portfolioResults => {
        let expectedResults = {
          totalInUSD: 10000.00,
          items: [
            {
              name: 'US Dollar',
              fsym: 'USD',
              currency_id: 1,
              amount: 10000.00,
              BTCPrice: 10000.00 * 0.0001157
            },
            {
              name: 'Bitcoin',
              fsym: 'BTC',
              currency_id: 2,
              amount: 0,
              BTCPrice: 0
            },
            {
              name: 'Litecoin',
              fsym: 'LCT',
              currency_id: 3,
              amount: 0,
              BTCPrice: 0
            },
            {
              name: 'Dogecoin',
              fsym: 'DOGE',
              currency_id: 4,
              amount: 0,
              BTCPrice: 0
            },
            {
              name: 'Monero',
              fsym: 'XMR',
              currency_id: 5,
              amount: 0,
              BTCPrice: 0
            }
          ]
        };
        return expect(portfolioResults).to.deep.equal(expectedResults);
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
    });
  });
});