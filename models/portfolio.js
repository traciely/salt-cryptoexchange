let Promise = require('bluebird');
let DB = require('./db.js');
let prices = require('./prices.js');

exports.getPortfolioByUserId = function getPortfolioByUserId(userId) {
  console.log(userId);
  return Promise.using(DB.getConnection(), connection => {
    let getPortfolioSQL = `SELECT c.name, c.fsym, uct.amount
      FROM user_currency_totals uct
      JOIN currencies c ON c.id = uct.currency_id
      WHERE uct.user_id = ?`;

    let promises = [
      connection.query(getPortfolioSQL, userId),
      prices.getCurrentPrices()
    ];
    return Promise.all(promises)
    .then(results => {
      let returnPortfolio = [];
      let portfolioResults = results[0];
      let prices = results[1];
      portfolioResults.forEach(item => {
        let portfolioItem = {
          name: item.name,
          fsym: item.fsym,
          amount: item.amount,
          BTCPrice: item.amount * prices[item.fsym].BTC
        };
        returnPortfolio.push(portfolioItem);
      });
      return Promise.resolve(returnPortfolio);
    })
    .catch(err => {
      return Promise.reject(err);
    });
  });
}