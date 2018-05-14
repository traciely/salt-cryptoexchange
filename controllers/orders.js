let ordersModel = require('../models/orders.js');

exports.createOrder = function createOrder(req, res, next) {
  if(!req.body.userId) {
    res.status(400);
    return next();
  }
  if(!req.body.toCurrency) {
    res.status(400);
    return next();
  }
  if(!req.body.fromCurrency) {
    res.status(400);
    return next();
  }
  if(! req.body.ammount) {
    res.status(400);
    return next();
  }

  let orderParams = {
    userId: req.body.userId,
    toCurrency: req.body.toCurrency,
    fromCurrency: req.body.fromCurrency,
    ammount: req.body.ammount
  };

  return ordersModel.createOrder(orderParams)
  .then(results => {
    return res.status(201).json(results);
  })
  .catch(err => {
    return res.status(500).send(err);
  })
}