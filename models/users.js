let config = require('config');
let Promise = require('bluebird');
let DB = require('./db.js');
let currenciesModel = require('./currencies.js');

exports.getUserByUsername = function getUserByUsername(username) {
  return Promise.using(DB.getConnection(), connection => {
    return connection.query('SELECT id, username, firstname, lastname FROM users WHERE username = ? limit 1;', username)
    .then((resultRows) => {
      let returnResult = {};
      if(resultRows.length) {
        returnResult = {
          id: resultRows[0].id,
          username: resultRows[0].username,
          firstName: resultRows[0].firstname,
          lastName: resultRows[0].lastname
        };
      }
      return Promise.resolve(returnResult);
    })
    .catch(err => {
      return Promise.reject(err);
    });
  }); 
}

exports.getUserById = function getUserById(id) {
  return Promise.using(DB.getConnection(), connection => {
    return connection.query('SELECT id, username, firstname, lastname FROM users WHERE id = ? limit 1;', id)
    .then((resultRows) => {
      let returnResult = {};
      if(resultRows.length) {
        returnResult = {
          id: resultRows[0].id,
          username: resultRows[0].username,
          firstName: resultRows[0].firstname,
          lastName: resultRows[0].lastname
        };
      }
      return Promise.resolve(returnResult);
    })
    .catch(err => {
      return Promise.reject(err);
    });
  });
}

exports.createUser = function createUser(params) {
  return Promise.using(DB.getConnection(), connection => {
    return connection.beginTransaction()
    .then( () => {
      return connection.query('INSERT INTO users SET ?', params)
      .then(userResult => {
        let userId = userResult.insertId;
        return currenciesModel.getCurrencies()
        .then(currencyResults => {
          let currencyInserts = [];
          for(key in currencyResults) {
          // currencyResults.forEach(currency => {
            let currencyArgs = {
              user_id: userId,
              currency_id: currencyResults[key].id,
              amount: currencyResults[key].fsym == 'USD' ? config.startingAmount : 0.00
            };
            currencyInserts.push(connection.query('INSERT INTO user_currency_totals SET ?', currencyArgs));
          };
          return Promise.all(currencyInserts)
          .then(() => {
            return connection.commit()
            .then(() => {
              return exports.getUserById(userId);
            })
            .catch(commitErr => {
              return connection.rollback()
              .then(() => {
                return Promise.reject(commitErr);
              });
            });
          });
        })
        .catch(currencyErr => {
          return connection.rollback()
          .then(() => {
            return Promise.reject(currencyErr);            
          });
        })
      })
      .catch(userErr => {
        return connection.rollback()
        .then(() => {
          if(userErr.code === 'ER_DUP_ENTRY') {
            return exports.getUserByUsername(params.username);
          }
          return Promise.reject(userErr);          
        });
      });
    })
    .catch(transactErr => {
      return connection.rollback()
      .then(() => {
        return Promise.reject(transactErr);
      });
    });
  });
}