let prices = require('../models/prices.js');
let config = require('config');

exports.getCurrentPrices = function getCurrentPrices(req, res, next) {
  prices.getCurrentPrices(config.fsym, config.tsym)
  .then(currentPrices => {
    res.status(200).send(currentPrices);
  })
  .catch(err => {
    console.log(err);
    res.status(500);
  });
}
