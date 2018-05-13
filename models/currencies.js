let DB = require('./db.js');
let Promise = require('bluebird');

exports.getCurrencies = function getCurrencies() {
  return Promise.using(DB.getConnection(), connection => {
    return connection.query('SELECT id, fsym FROM currencies')
    .then(currencyResults => {
      let currencies = [];
      currencyResults.forEach(currency => {
        currencies.push({
          id: currency.id,
          fsym: currency.fsym
        });
      })
      // return currencies;
      return Promise.resolve(currencies);
    })
    .catch(err => {
      throw new Error(err);
    });
  });
}