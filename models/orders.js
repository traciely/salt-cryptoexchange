let Promise = require('bluebird');
let DB = require('./db.js');
let pricesModel = require('./prices.js');
let portfolioModel = require('./portfolio.js');
let currenciesModel = require('./currencies.js');

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
    return Promise.reject({Error: 'No order to be made', Code: 'SAME_CURRENCY_ERR'})
  } else if(fromCurrency == 'USD' && toCurrency != 'BTC') {
    return Promise.reject({Error: 'Cannot sell USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
  } else if(toCurrency == 'USD' &&  fromCurrency != 'BTC') {
    return Promise.reject({Error: 'Cannot buy USD for anything other than BTC', Code: 'USD_CURRENCY_ERR'});
  } else if(toBTC.includes(toCurrency) && fromCurrency != 'BTC') {
    return Promise.reject({Error: 'Cannot buy alt currency with another alt currency', Code: 'ALT_CURRENCY_ERR'});
  }

  // if we get here, we've verified that we can at least transfer to/from these currencies baesd on buying and selling rules
  return Promise.all([pricesModel.getCurrentPrices(), portfolioModel.getPortfolioByUserId(params.userId), currenciesModel.getCurrencies()])
  .then(results => {
    // got the current price for buying/selling and what assets we have available to buy/sell
    // so let's first see if we have the right # of assets to buy/sell
    let currentPrices = results[0];
    let userPortfolio = results[1];
    let currencies = results[2];

    let orderPrice = amount * currentPrices[toCurrency][fromCurrency];
   
   let rejectForFunds = false;
    userPortfolio.items.forEach(item => {
      if(item.fsym == fromCurrency && orderPrice > item.amount) {
        rejectForFunds = true;
      }
    });
    if(rejectForFunds) {
      return Promise.reject({Error: 'Not enough funds to support order', Code: 'INSUFFICIENT_FUNDS_ERR'});
    }

    // if we get here, we need to create the order and update the portfolio
    return Promise.using(DB.getConnection(), connection => {
      return connection.beginTransaction()
      .then(() => {
        let order = {
          user_id: userId,
          from_currency_id: currencies[fromCurrency].id,
          to_currency_id: currencies[toCurrency].id,
          amount: amount,
          order_price: orderPrice
        };
        return connection.query('INSERT INTO orders SET ?', order)
        .then((insertResults) => {
          let toCurrencyAmount = toCurrency == 'USD' ? orderPrice : amount;
          let fromCurrencyAmount = fromCurrency == 'USD' ? orderPrice : amount;
          return Promise.all([
            connection.query('UPDATE user_currency_totals SET amount = (amount - ?) WHERE user_id = ? AND currency_id = ?', [fromCurrencyAmount, userId, currencies[fromCurrency].id]),
            connection.query('UPDATE user_currency_totals SET amount = (amount + ?) WHERE user_id = ? AND currency_id = ?', [toCurrencyAmount, userId, currencies[toCurrency].id])
          ])
          .then(() => {
            return connection.commit()
            .then(() => {
              return portfolioModel.getPortfolioByUserId(userId);
            })
            .catch(commitErr => {
              return connection.rollback()
              .then(() => {
                return Promise.reject(commitErr);
              })
            });
          })
          .catch((updateErr) => {
            return connection.rollback()
            .then(() => {
              return Promise.reject(updateErr);
            });
          })
        })
        .catch(insertErr => {
          return connection.rollback()
          .then(() => {
            return Promise.reject(insertErr);
          });
        })
      })
      .catch(transactionErr => {
        return Promise.reject(transactionErr);
      });
    })
    .catch(connectionErr => {
      return Promise.reject(connectionErr);
    })
  })
  .catch(createOrderErr => {
    return Promise.reject(createOrderErr);
  });
}