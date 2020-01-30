const Utils = require('./utils');
const controller = require('./controller');

const PAGE = 'contact';
const TITLE = 'Contatos';
const SUBTITLE = 'Diga um oi!';
const BACKGROUND = 3;
const TABLE = 'tb_contacts';
const FIELDS = ['name', 'email', 'message'];

module.exports = {
    render(req, res, message, error) {
        controller.render(req, res, PAGE, TITLE, SUBTITLE, BACKGROUND, message, error);
    },
    save(body) {
        const dbObject = Utils.setDBObject(TABLE, FIELDS, body);
        return controller.save(dbObject);
    },
    getContacts() {
        return controller.getData(TABLE, 'name');
    },
    delete(id) {
        return controller.delete({ table: TABLE, id });
    }
}
