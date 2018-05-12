const mysql = require('mysql');
const Promise = require('bluebird');
const config = require('config');

export default class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if(err) return reject(err);
        return resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if(err) return reject(err);
        return resolve();
      });
    });
  }
}
