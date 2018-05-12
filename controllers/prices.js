let prices = require('../models/prices.js');

const FSYM = ['BTC','LCT','DOGE','XMR'];
const TSYM = ['USD', 'BTC'];

exports.getCurrentPrices = function getCurrentPrices(req, res, next) {
  prices.getCurrentPrices(FSYM.join(','), TSYM.join(','))
  .then(currentPrices => {
    res.status(200).send(currentPrices);
  })
  .catch(err => {
    console.log(err);
    res.status(500);
  });
}
