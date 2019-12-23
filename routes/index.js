var express = require('express');
var router = express.Router();

const api = require('../inc/api');
const Utils = require('../inc/utils');
const contacts = require('../inc/contacts');
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
  contacts.render(req, res);
});

router.post('/contacts', function(req, res, next) {
  if (!req.body.name) return contacts.render(req, res, 'Digite o nome', true);
  if (!req.body.email) return contacts.render(req, res, 'Digite o e-mail', true);
  if (!req.body.message) return contacts.render(req, res, 'Digite a mensagem', true);

  contacts.save(req.body)
    .then(results => {
      req.body = {};
      contacts.render(req, res, 'Contato enviado com sucesso!')
    }).catch(err => contacts.render(req, res, err.message, true))
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
  reservations.render(req, res);
});

router.post('/reservations', function(req, res, next) {
  if (!req.body.name) return reservations.render(req, res, 'Digite o nome', true);
  if (!req.body.email) return reservations.render(req, res, 'Digite o e-mail', true);
  if (!req.body.people) return reservations.render(req, res, 'Informe quantas pessoas', true);
  if (!req.body.date) return reservations.render(req, res, 'Informe a data', true);
  if (!req.body.time) return reservations.render(req, res, 'Informe o horário', true);

  reservations.save(req.body).then(results => {
    req.body = {};
    reservations.render(req, res, 'Reserva realizada com sucesso!')
  }).catch(err => {
    req.body.date = Utils.formatDateToView(req.body.date);
    reservations.render(req, res, err.message, true)
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
