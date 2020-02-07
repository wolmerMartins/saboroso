const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password: 'password',
    multipleStatements: true
});

module.exports = connect;
