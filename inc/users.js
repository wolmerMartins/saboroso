const Utils = require('./utils');
const controller = require('./controller');

const PAGE = 'admin/login';
const TITLE = 'Login';
const TABLE = 'tb_users';
const FIELDS = ['name', 'email', 'password'];

module.exports = {
    render(req, res, message, error) {
        controller.render(req, res, PAGE, TITLE, null, null, message, error);
    },
    login(body) {
        return controller.login(body);
    },
    getUsers() {
        return controller.getData(TABLE, 'name');
    },
    save(body) {
        let dbObj = {};

        if (body.id) {
            dbObj = Utils.setDBObject(Utils.getUpdateType(), TABLE, body);
            return controller.update(dbObj);
        }

        dbObj = Utils.setDBObject(Utils.getSaveType(), TABLE, FIELDS, body);
        return controller.save(dbObj);
    }
}
