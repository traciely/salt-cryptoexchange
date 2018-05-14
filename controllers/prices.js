let pricesModel = require('../models/prices.js');
let config = require('config');

exports.getCurrentPrices = function getCurrentPrices(req, res, next) {
  return pricesModel.getCurrentPrices(config.fsym, config.tsym)
  .then(currentPrices => {
    return res.status(200).json(currentPrices);
  })
  .catch(err => {
    return res.status(500);
  });
}
