let Promise = require('bluebird');
let DB = require('./db.js');
let pricesModel = require('./prices.js');
let portfolioModel = require('./portfolio.js');

exports.getOrdersByUserId = function getOrdersByUserId(userId) {
  return Promise.using(DB.getConnection(), connection => {
    let getOrdersSQL = `SELECT c1.name as from_currency, c2.name as to_currency, o.amount, o.order_price
      FROM orders o
      JOIN currencies c1 on c1.id = o.from_currency_id
      JOIN currencies c2 on c2.id = o.to_currency_id
      WHERE o.user_id = ?
      ORDER BY o.id desc`;
      return connection.query(getOrdersSQL, userId)
      .then(ordersReults => {
        console.log(ordersReults);
        return Promise.resolve(ordersReults);
      })
      .catch(ordersErr => {
        return Promise.reject(ordersErr);
      })
  });
}

exports.createOrder = function createOrder(params) {
  // first thing we need to do is check whether the order is valid
  // step one is check whether our order is going between two valid currencies
  let toBTC = ['LCT','DOGE','XMR'];
  let toCurrency = params.toCurrency;
  let fromCurrency = params.fromCurrency;
  let amount = params.amount;
  let userId = params.userId;

  if(fromCurrency == toCurrency) {
    return Promse.reject({Error: 'No order to be made', Code: 'SAME_CURRENCY_ERR'})
  } else if(fromCurrency == 'USD' && toCurrency != 'BTC') {
    return Promise.reject({Error: 'Cannot sell USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
  } else if(toCurrency == 'USD' &&  fromCurrency != 'BTC') {
    return Promise.reject({Error: 'Cannot buy USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
  } else if(toCurrency != 'BTC' && !toBTC.includes(fromCurrency)) {
    return Promise.reject({Error: 'Cannot buy alt currency with another alt currency', Code: 'ALT_CURRENCY_ERR'});
  }
  
  // if we get here, we've verified that we can at least transfer to/from these currencies baesd on buying and selling rules
  return Promise.all([pricesModel.getCurrentPrices(), portfolioModel.getPortfolioByUserId(params.userId)]);
  .then(results => {
    // got the current price for buying/selling and what assets we have available to buy/sell
    // so let's first see if we have the right # of assets to buy/sell
    let currentPrices = results[0];
    let userPortfolio = results[1];
    let order_price = 0;
    // if(fromCurrency == 'USD') {
    //   // this is a special case as we need to determine whether the amount we want to buy is something we can afford
    //   order_price = amount * currentPrices[toCurrency].USD;
    //   if(order_price > userPortfolio.items['USD'].amount) {
    //     return Promise.reject({Error: 'Not enough funds to support order', Code: 'INSUFFICIENT_FUNDS_ERR'});
    //   }
    // } else {
    //   // just need to compare the # of bitcoins available to how  
    // }


    return Promise.using(DB.getConnection(), connection => {
      
    });    
  })
}