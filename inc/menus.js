const path = require('path');

const db = require('./db');
const Utils = require('./utils');
const controller = require('./controller');

const MENU_TABLE = 'tb_menus';
const MENU_FIELDS = ['title', 'description', 'price', 'photo'];

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
        fields.photo = `images/${path.parse(files.photo.path).base}`;
        const dbObj = Utils.setDBObject(MENU_TABLE, MENU_FIELDS, fields);
        return controller.save(dbObj);
    }
}