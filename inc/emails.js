const controller = require('./controller');

const TABLE = 'tb_emails';

module.exports = {
    getEmails() {
        return controller.getData(TABLE, 'register DESC');
    },
    delete(id) {
        return controller.delete({ table: TABLE, id });
    }
};
