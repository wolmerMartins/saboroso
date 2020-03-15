const path = require('path');

const Utils = require('./utils');
const controller = require('./controller');

const MENU_TABLE = 'tb_menus';
const MENU_FIELDS = ['title', 'description', 'price', 'photo'];

module.exports = {
    getMenus: () => {
        return controller.getData(MENU_TABLE, 'title');
    },
    save(fields, files) {
        let dbObj;
        if (files.photo.size) fields.photo = `images/${path.parse(files.photo.path).base}`;
        
        if (fields.id) {
            dbObj = Utils.setDBObject('update', MENU_TABLE, fields);
            return controller.update(dbObj);
        }
        
        dbObj = Utils.setDBObject('save', MENU_TABLE, MENU_FIELDS, fields);
        return controller.save(dbObj);
    },
    delete(id) {
        return controller.delete({ id, table: MENU_TABLE });
    }
}
