let user = require('../models/users.js');

exports.getUser = function getUser(req, res, next) {
  
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

  user.createUser(userParams)
    .then(results => {
      return res.status(201).send(results);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
}