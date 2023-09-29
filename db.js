const mysql = require('mysql2');
const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
let pool = mysql.createPool({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    connectionLimit: conf.connectionLimit
  });

function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if(!err) {
      callback(conn);
    }
  });
}

module.exports = getConnection;

