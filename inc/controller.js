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
    }
}
