var express = require('express');
var router = express.Router();

const db = require('../inc/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM tb_users ORDER BY name', (err, results) => {
    if (err) return res.send(err);

    res.send(results);
  });
});

module.exports = router;
