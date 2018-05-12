let DB = require('./db.js');
let dbConnection = new DB();

export.createUser(params) {
  return dbConnection.query('INSERT INTO users SET ?', params)
  .then(userResult => {
    let userId = userResult.insertId;
    
  })
  .catch(err => {
    throw new Error(err);
  });
}