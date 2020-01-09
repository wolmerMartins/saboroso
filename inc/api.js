const path = require('path');

const db = require('./db');

module.exports = {
    getMenus: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tb_menus ORDER BY title', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        })
    },
    save(fields, files) {
        return new Promise((resolve, reject) => {
            fields.photo = `images/${path.parse(files.photo.path).base}`;

            db.query(`INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)`, [
                    fields.title,
                    fields.description,
                    fields.price,
                    fields.photo
                ], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
        });
    }
}
