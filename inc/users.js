const controller = require('./controller');

const PAGE = 'admin/login';
const TITLE = 'Login';
const TABLE = 'tb_users';

module.exports = {
    render(req, res, message, error) {
        controller.render(req, res, PAGE, TITLE, null, null, message, error);
    },
    login(body) {
        return controller.login(body);
    },
    getUsers() {
        return controller.getData(TABLE, 'name');
    }
}
