const db = require('./db');

module.exports = {
    render(req, res, title, error, success) {
        res.render('reservation', {
            title: `Reservas | ${title}`,
            h1: 'Reserve uma mesa!',
            background: 'images/img_bg_2.jpg',
            body: req.body,
            error,
            success
        });
    },
    save(fields) {
        return new Promise((resolve, reject) => {
            let date = fields.date.split('/');
            fields.date = `${date[2]}-${date[1]}-${date[0]}`;
    
            db.query('INSERT INTO tb_reservations (name, email, people, date, time) ' +
                'VALUES (?, ?, ?, ?, ?)', [
                    fields.name,
                    fields.email,
                    fields.people,
                    fields.date,
                    fields.time
                ], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
        });
    }
}