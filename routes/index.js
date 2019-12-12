var express = require('express');
var router = express.Router();

const db = require('../inc/db');

const TITLE = 'Restaurante Saboroso!';
const QUERY = 'SELECT * FROM tb_menus ORDER BY title';

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query(QUERY, (err, results) => {
    if (err) return console.log(err);

    res.render('index', {
      title: TITLE,
      menus: results,
      features: [
        {
          icon: 'ti-face-smile',
          h3: 'Pessoas Felizes'
        },
        {
          icon: 'ti-thought',
          h3: 'Culinária Criativa'
        },
        {
          icon: 'ti-truck',
          h3: 'Delivery'
        }
      ]
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
  db.query(QUERY, (err, results) => {
    if (err) return console.log(err)
    
    res.render('menu', {
      menus: results,
      title: `Menu | ${TITLE}`,
      h1: 'Saboreie nosso menu!',
      background: 'images/img_bg_1.jpg'
    });
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
    background: 'images/img_bg_1.jpg',
    features: [
      {
        icon: 'ti-face-smile',
        h3: 'Pessoas Felizes'
      },
      {
        icon: 'ti-thought',
        h3: 'Culinária Criativa'
      },
      {
        icon: 'ti-truck',
        h3: 'Delivery'
      },
      {
        icon: 'ti-face-smile',
        h3: 'Pessoas Felizes'
      },
      {
        icon: 'ti-thought',
        h3: 'Culinária Criativa'
      },
      {
        icon: 'ti-truck',
        h3: 'Delivery'
      }
    ]
  });
});

module.exports = router;
