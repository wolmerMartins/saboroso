var express = require('express');
var router = express.Router();

const api = require('../inc/api');

const TITLE = 'Restaurante Saboroso!';

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let menus = await api.getMenus();

    res.render('index', {
      menus,
      title: TITLE,
      isHome: true,
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
  } catch(err) {
    console.log(err);
  }
});

router.get('/contacts', function(req, res, next) {
  res.render('contact', {
    title: `Contato | ${TITLE}`,
    h1: 'Diga um oi!',
    background: 'images/img_bg_3.jpg'
  });
});

router.get('/menus', async function(req, res, next) {
  try {
    let menus = await api.getMenus();
    
    res.render('menu', {
      menus,
      title: `Menu | ${TITLE}`,
      h1: 'Saboreie nosso menu!',
      background: 'images/img_bg_1.jpg'
    });
  } catch(err) {
    console.log(err);
  }
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
