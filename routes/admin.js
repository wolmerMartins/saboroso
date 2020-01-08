const express = require('express');
const router = express.Router();

const admin = require('../inc/admin');
const users = require('../inc/users');
const api = require('../inc/api');

router.use(function(req, res, next) {
    if (!['/login'].includes(req.url) && !req.session.user) {
        return res.redirect('/admin/login');
    }

    if (['/login'].includes(req.url) && req.session.user) {
        return res.redirect('/admin/');
    }

    next();
});

router.use(function(req, res, next) {
    req.menus = admin.getMenus(req);
    next();
});

router.get('/contacts', function(req, res, next) {
    res.render('admin/contacts', admin.getParams(req));
});

router.get('/emails', function(req, res, next) {
    res.render('admin/emails', admin.getParams(req));
});

router.get('/', function(req, res, next) {
    admin.dashboard().then(data => {
        res.render('admin/index', admin.getParams(req, { data }));
    }).catch(err => {
        console.error(err);
        res.render('admin/index', admin.getParams(req, { data: {
            nrcontacts: 0,
            nrmenus: 0,
            nrreservations: 0,
            nrusers: 0
        }}))
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
    api.getMenus().then(data => {
        res.render('admin/menus', admin.getParams(req, { rows: data }));
    }).catch(err => {
        console.error(err);
        res.render('admin/menus', admin.getParams(req, { rows: [] }));
    });
});

router.get('/reservations', function(req, res, next) {
    res.render('admin/reservations', admin.getParams(req, {
        date: {}
    }));
});

router.get('/users', function(req, res, next) {
    res.render('admin/users', admin.getParams(req));
});


module.exports = router;
