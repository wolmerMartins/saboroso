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
  res.render('contact', {
    title: `Contato | ${TITLE}`,
    h1: 'Diga um oi!',
    background: 'images/img_bg_3.jpg'
  });
});

router.get('/menus', function(req, res, next) {
  res.render('menu', {
    title: `Menu | ${TITLE}`,
    h1: 'Saboreie nosso menu!',
    background: 'images/img_bg_1.jpg'
  });
});

router.get('/reservations', function(req, res, next) {
  res.render('reservation', {
    title: `Reservas | ${TITLE}`,
    h1: 'Reserve uma Mesa!',
    background: 'images/img_bg_2.jpg'
  });
});

router.get('/services', function(req, res, next) {
  res.render('services', {
    title: `Serviços | ${TITLE}`,
    h1: 'É um prazer poder servir!',
    background: 'images/img_bg_1.jpg'
  });
});

module.exports = router;
