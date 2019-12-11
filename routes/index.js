var express = require('express');
var router = express.Router();

const db = require('../inc/db');

const TITLE = 'Restaurante Saboroso!';

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM tb_menus ORDER BY title', (err, results) => {
    if (err) return console.log(err);

    res.render('index', {
      title: TITLE,
      menus: results
    });
  });
});

router.get('/contacts', function(req, res, next) {
  res.render('contact', { title: `Contato | ${TITLE}` });
});

router.get('/menus', function(req, res, next) {
  res.render('menu', { title: `Menu | ${TITLE}` });
});

router.get('/reservations', function(req, res, next) {
  res.render('reservation', { title: `Reservas | ${TITLE}` });
});

router.get('/services', function(req, res, next) {
  res.render('services', { title: `Serviços | ${TITLE}`})
});

module.exports = router;
