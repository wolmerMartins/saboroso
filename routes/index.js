var express = require('express');
var router = express.Router();

const api = require('../inc/api');
const reservations = require('../inc/reservations');

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
  reservations.render(req, res, TITLE);
});

router.post('/reservations', function(req, res, next) {
  if (!req.body.name) return reservations.render(req, res, TITLE, 'Digite o nome');
  if (!req.body.email) return reservations.render(req, res, TITLE, 'Digite o e-mail');
  if (!req.body.people) return reservations.render(req, res, TITLE, 'Informe quantas pessoas');
  if (!req.body.date) return reservations.render(req, res, TITLE, 'Informe a data');
  if (!req.body.time) return reservations.render(req, res, TITLE, 'Informe o horário');

  reservations.save(req.body).then(results => {
    req.body = {};
    reservations.render(req, res, TITLE, null, 'Reserva realizada com sucesso!')
  }).catch(err => {
    reservations.render(req, res, TITLE, err.message, null)
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
