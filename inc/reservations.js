const Utils = require('./utils');
const controller = require('./controller');

const PAGE = 'reservation';
const TITLE = 'Reservas';
const SUBTITLE = 'Reserve uma mesa!';
const BACKGROUND = 2;
const TABLE = 'tb_reservations';
const FIELDS = ['name', 'email', 'people', 'date', 'time'];

module.exports = {
    render(req, res, message, error) {
        controller.render(req, res, PAGE, TITLE, SUBTITLE, BACKGROUND, message, error);
    },
    save(body) {
        body.date = Utils.formatDateToBD(body.date);
        const dbObj = Utils.setDBObject(TABLE, FIELDS, body);

        return controller.save(dbObj);
    }
}