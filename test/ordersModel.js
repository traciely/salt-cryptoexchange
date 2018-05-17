let mocha = require('mocha');
let expect = require('chai').expect;
let sinon = require('sinon');
let Promise = require('bluebird');
let DB = require('../models/DB.js');
let ordersModel = require('../models/orders.js');
let pricesModel = require('../models/prices.js');
let portfolioModel = require('../models/portfolio.js');

describe('Orders Model Tests', function() {
  before(function() {
    // clear out db tables;
    return Promise.using(DB.getConnection(), connection => {
      connection.query('TRUNCATE TABLE orders;');
    });
  });
  describe('getOrdersByUserId', function() {
    it('should return back an empty array if user has no orders', function() {
      return ordersModel.getOrdersByUserId(1)
      .then(ordersResults => {
        return expect(ordersResults).to.deep.equal([]);
      });
    });
  });

  describe('createOrder', function() {
    let params;
    let pricesModelStub;
    let portfolioModelStub;
    
    before(function() {
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

      portfolioModelStub = sinon.stub(portfolioModel, 'getPortfolioByUserId')
      .resolves({
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
      });
    })
    beforeEach(function() {
      params = {
        toCurrency: null,
        fromCurrency: null,
        amount: 0,
        userId: 1
      };
    });

    after(function() {
      pricesModelStub.restore();
      portfolioModelStub.restore();
    });

    it('should return an error if the order contains the same currency', function() {
      params.toCurrency = 'USD';
      params.fromCurrency = 'USD';
      return ordersModel.createOrder(params)
      .catch((err) => {
        return expect(err).to.deep.equal({Error: 'No order to be made', Code: 'SAME_CURRENCY_ERR'});
      });
    });
    it('should return an error if the order is to sell USD for something other than BTC', function() {
      params.toCurrency = 'LCT';
      params.fromCurrency = 'USD';
      return ordersModel.createOrder(params)
      .catch((err) => {
        return expect(err).to.deep.equal({Error: 'Cannot sell USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
      });
    });
    it('should return an error if the order is to buy USD but from something oter than BTC', function() {
      params.toCurrency = 'USD';
      params.fromCurrency = 'DOGE';
      return ordersModel.createOrder(params)
      .catch((err) => {
        return expect(err).to.deep.equal({Error: 'Cannot buy USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
      });
    });
    it('should return an error if the order is to buy an alt currency from something other than BTC', function() {
      params.toCurrency = 'LCT';
      params.fromCurrency = 'DOGE';
      return ordersModel.createOrder(params)
      .catch((err) => {
        return expect(err).to.deep.equal({Error: 'Cannot buy alt currency with another alt currency', Code: 'ALT_CURRENCY_ERR'});
      });
    });
    it('should return an error if the order amount is more than we have available (USD to BTC)', function() {
      params.toCurrency = 'BTC';
      params.fromCurrency = 'USD';
      params.amount = 3;
      return ordersModel.createOrder(params)
      .catch((err) => {
        return expect(err).to.deep.equal({Error: 'Not enough funds to support order', Code: 'INSUFFICIENT_FUNDS_ERR'});
      });
    });

    it.only('should return back the user portfolio if the order was sucessful', function() {
      params.toCurrency = 'BTC';
      params.fromCurrency = 'USD';
      params.amount = 1;
      return ordersModel.createOrder(params)
      .then(portfolioResult => {
        console.log(portfolioResult);
        return expect(portfolioResult).to.deep.equal({
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
        });
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
    });
  });
});