var express = require('express');
var router = express.Router();

const db = require('../inc/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM tb_menus ORDER BY title', (err, results) => {
    if (err) return console.log(err);

    res.render('index', {
      title: 'Restaurante Saboroso!',
      menus: results
    });
  });
});

module.exports = router;
