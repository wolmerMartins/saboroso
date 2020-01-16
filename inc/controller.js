const db = require('./db');

module.exports = {
    render(req, res, page, title, h1, bg, message, error) {
        res.render(page, {
            title: `${title} | Restaurante Saboroso`,
            background: `images/img_bg_${bg}.jpg`,
            body: req.body,
            message,
            error,
            h1
        });
    },
    save(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${dbObj.table} (${dbObj.fields}) VALUES (${dbObj.columns})`,
                dbObj.values, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    },
    update(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${dbObj.table} SET ${dbObj.update} WHERE id = ${dbObj.id}`,
                dbObj.values, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    },
    delete(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${dbObj.table} WHERE id = ?`, [dbObj.id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    login(body) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tb_users WHERE email = ?', [ body.email ], (err, results) => {
                if (err) return reject(err);
                if (!results.length) return reject(new Error('Usuário ou senha incorretos'));

                let row = results[0];

                if (row.password !== body.password) return reject(new Error('Usuário ou senha incorretos'));
                resolve(row);
            });
        });
    },
    getData(table, orderBy) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}
