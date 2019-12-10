const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password: 'password'
});

module.exports = connect;
