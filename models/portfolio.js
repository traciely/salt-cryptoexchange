let Promise = require('bluebird');
let DB = require('./db.js');
let pricesModel = require('./prices.js');

exports.getPortfolioByUserId = function getPortfolioByUserId(userId) {
  return Promise.using(DB.getConnection(), connection => {
    let getPortfolioSQL = `SELECT c.name, c.fsym, uct.currency_id, uct.amount
      FROM user_currency_totals uct
      JOIN currencies c ON c.id = uct.currency_id
      WHERE uct.user_id = ?`;

    let promises = [
      connection.query(getPortfolioSQL, userId),
      pricesModel.getCurrentPrices()
    ];
    return Promise.all(promises)
    .then(results => {
      let returnPortfolio = {
        totalInUSD: 0,
        items: []
      };
      let portfolioResults = results[0];
      let prices = results[1];
      portfolioResults.forEach(item => {
        let portfolioItem = {
          name: item.name,
          fsym: item.fsym,
          currency_id: item.currency_id,
          amount: item.amount,
          BTCPrice: item.amount * prices[item.fsym].BTC
        };
        returnPortfolio.totalInUSD += item.amount * prices[item.fsym].USD;
        returnPortfolio.items.push(portfolioItem);
      });
      return Promise.resolve(returnPortfolio);
    })
    .catch(err => {
      return Promise.reject(err);
    });
  });
}