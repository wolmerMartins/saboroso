const express = require('express');
const router = express.Router();
const moment = require('moment');

const menu = require('../inc/menus');
const admin = require('../inc/admin');
const users = require('../inc/users');
const email = require('../inc/emails');
const contacts = require('../inc/contacts');
const reservation = require('../inc/reservations');

moment.locale('pt-BR');

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
    contacts.getContacts().then(({ data, links }) => {
        res.render('admin/contacts', admin.getParams(req, {
            contacts: data,
            links
        }));
    });
});

router.delete('/contacts/:id', function(req, res, next) {
    const { id } = req.params;

    contacts.delete(id)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.get('/emails', function(req, res, next) {
    email.getEmails().then(({ data, links }) => {
        res.render('admin/emails', admin.getParams(req, {
            emails: data,
            links
        }));
    });
});

router.delete('/emails/:id', function(req, res, next) {
    const { id } = req.params;

    email.delete(id)
        .then(results => res.send(results))
        .catch(err => res.send(err));
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
    menu.getMenus().then(({ data, links }) => {
        res.render('admin/menus', admin.getParams(req, {
            rows: data,
            links
        }));
    }).catch(err => {
        console.error(err);
        res.render('admin/menus', admin.getParams(req, { rows: [] }));
    });
});

router.post('/menus', function(req, res, next) {
    menu.save(req.fields, req.files)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.delete('/menus/:id', function(req, res, next) {
    menu.delete(req.params.id)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.get('/reservations', function(req, res, next) {
    const {
        page,
        end: dateEnd,
        limit: perPage,
        start: dateStart
    } = req.query;

    const start = (dateStart) ? moment(dateStart).format('YYYY-MM-DD') : null;
    const end = (dateEnd) ? moment(dateEnd).format('YYYY-MM-DD') : null;

    reservation.getReservations({ page, dateStart, dateEnd, perPage })
        .then(({ data, links }) => {
            res.render('admin/reservations', admin.getParams(req, {
                date: { start, end },
                reservations: data,
                moment,
                links
            }));
        })
        .catch(err => {
            res.render('admin/reservations', admin.getParams(req, {
                reservations: [],
                date: {},
                moment
            }));
        });
});

router.get('/reservations/chart', function(req, res, next) {
    const { start, end } = req.query;

    reservation.chart({ start, end })
        .then(chartData => {
            res.send(chartData);
        });
});

router.post('/reservations', function(req, res, next) {
    reservation.save(req.fields, req.files)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.delete('/reservations/:id', function(req, res, next) {
    let { id } = req.params;

    reservation.delete(id)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.get('/users', function(req, res, next) {
    users.getUsers().then(({ data, links }) => {
        res.render('admin/users', admin.getParams(req, {
            users: data,
            links
        }));
    });
});

router.post('/users', function(req, res, next) {
    users.save(req.fields)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});

router.delete('/users/:id', function(req, res, next) {
    let { id } = req.params;

    users.delete(id)
        .then(results => res.send(results))
        .catch(err => res.send(err));
});


module.exports = router;
