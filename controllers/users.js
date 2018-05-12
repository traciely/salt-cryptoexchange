let user = require('../models/users.js');

exports.getUser = function getUser(req, res, next) {
  
}

exports.createUser = function createUser(req, res, next) {
  if(!req.body.username) {
    res.status(400).send({error: 'No username'});
  }
  if(!req.body.firstname) {
    res.status(400).send({error: 'No First Name'});
  }
  if(!req.body.lastname) {
    res.status(400).send({error: 'No Last Name'});
  }
  if(!req.body.pwd) {
    res.status(400).send({error: 'No pwd'})
  }

  let userParams = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    pwd: req.body.pwd
  }

  user.createUser(userParams)
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}