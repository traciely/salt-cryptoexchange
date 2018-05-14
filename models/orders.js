let Promise = require('bluebird');
let DB = require('./db.js');
let prices = require('../prices.js');

exports.getOrdersByUserId = function getOrdersByUserId(userId) {
  return Promise.using(DB.getConnection(), connection => {
    let getOrdersSQL `SELECT c1.name as from_currency, c2.name as to_currency, o.amount, o.order_price
      FROM orders o
      JOIN currencies c1 on c1.id = o.from_currency_id
      JOIN currencies c2 on c2.id = o.to_currency_id
      WHERE o.user_id = ?`;
      return connection.query(getOrdersSQL, userId)
      .then(ordersReults => {
        
      })
      .catch(ordersErr => {
        return Promise.reject(ordersErr);
      })
  });
}