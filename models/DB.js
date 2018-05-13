const mysql = require('promise-mysql');
const Promise = require('bluebird');
const config = require('config');

let pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  connectionLimit: 10
});

exports.getConnection = function getConnection() {
  return pool.getConnection().disposer(connection => {
    pool.releaseConnection(connection);
  });
}