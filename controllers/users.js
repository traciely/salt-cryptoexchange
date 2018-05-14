let _ = require('lodash');
let usersModel = require('../models/users.js');
let portFolioModel = require('../models/portfolio.js');
let ordersModel = require('../models/orders.js');

exports.getUser = function getUser(req, res, next) {
  let username = req.params.username;

  return usersModel.getUserByUsername(username)
  .then(results => {
    if(_.isEmpty(results)) {
      res.status(404);
      return next();
    }
    return res.status(200).send(results);
  })
  .catch(err => {
    return res.status(500).send(err);
  })
}

exports.createUser = function createUser(req, res, next) {
  if(!req.body.username) {
    return res.status(400).send({error: 'No username'});
  }
  if(!req.body.firstname) {
    return res.status(400).send({error: 'No First Name'});
  }
  if(!req.body.lastname) {
    return res.status(400).send({error: 'No Last Name'});
  }

  let userParams = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  return usersModel.createUser(userParams)
    .then(results => {
      return res.status(201).json(results);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
}

exports.getPortfolio = function getPortfolio(req, res, next) {
  let userId = req.params.user_id;
  return portFolioModel.getPortfolioByUserId(userId)
  .then(results => {
    return res.status(200).json(results);
  })
  .catch(err => {
    return res.status(500).send(err);
  });
}

exports.getOrders = function getOrders(req, res, next) {
  let userId = req.params.user_id;
  return ordersModel.getOrderByUserId(userId)
  .then(results => {
    return res.status(200).json(results);
  })
  .catch(err => {
    return res.status(500).send(err);
  });
}