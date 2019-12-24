const express = require('express');
const router = express.Router();

const users = require('../inc/users');

router.get('/contacts', function(req, res, next) {
    res.render('admin/contacts');
});

router.get('/emails', function(req, res, next) {
    res.render('admin/emails');
});

router.get('/', function(req, res, next) {
    res.render('admin/index');
});

router.get('/login', function(req, res, next) {
    users.render(req, res);
});

router.post('/login', function(req, res, next) {
    if (!req.body.email) return users.render(req, res, 'Informe o e-mail', true);
    if (!req.body.password) return users.render(req, res, 'Informe a senha', true);

    users.login(req.body)
        .then(user => {
            req.session.user = user;
            res.redirect('/admin');
        }).catch(err => users.render(req, res, err.message, true));
});

router.get('/menus', function(req, res, next) {
    res.render('admin/menus');
});

router.get('/reservations', function(req, res, next) {
    res.render('admin/reservations', {
        date: {}
    });
});

router.get('/users', function(req, res, next) {
    res.render('admin/users');
});


module.exports = router;
