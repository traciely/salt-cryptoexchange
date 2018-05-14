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
  return Promise.all([pricesModel.getCurrentPrices(), portfolioModel.getPortfolioByUserId(params.userId)]);
  .then(results => {
    return Promise.using(DB.getConnection(), connection => {
      
    });    
  })
}