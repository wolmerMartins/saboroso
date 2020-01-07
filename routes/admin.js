const express = require('express');
const router = express.Router();

const admin = require('../inc/admin');
const users = require('../inc/users');

router.use(function(req, res, next) {
    if (!['/login'].includes(req.url) && !req.session.user) {
        return res.redirect('/admin/login');
    }

    next();
});

router.use(function(req, res, next) {
    req.menus = admin.getMenus(req);
    next();
});

router.get('/contacts', function(req, res, next) {
    res.render('admin/contacts', {
        menus: req.menus
    });
});

router.get('/emails', function(req, res, next) {
    res.render('admin/emails', {
        menus: req.menus
    });
});

router.get('/', function(req, res, next) {
    res.render('admin/index', {
        menus: req.menus
    });
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

router.get('/logout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/admin/login')
});

router.get('/menus', function(req, res, next) {
    res.render('admin/menus', {
        menus: req.menus
    });
});

router.get('/reservations', function(req, res, next) {
    res.render('admin/reservations', {
        menus: req.menus,
        date: {}
    });
});

router.get('/users', function(req, res, next) {
    res.render('admin/users', {
        menus: req.menus
    });
});


module.exports = router;
