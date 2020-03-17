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
    getReservations({ page, perPage, dateStart, dateEnd }) {
        return controller.getData(TABLE, 'date', page, perPage, dateStart, dateEnd);
    },
    save(body) {
        let dbObj = {};
        if (~body.date.indexOf('/')) body.date = Utils.formatDateToBD(body.date);

        if (body.id) {
            dbObj = Utils.setDBObject(Utils.getUpdateType(), TABLE, body);
            return controller.update(dbObj);
        }
        
        dbObj = Utils.setDBObject(Utils.getSaveType(), TABLE, FIELDS, body);
        return controller.save(dbObj);
    },
    delete(id) {
        return controller.delete({ table: TABLE, id });
    },
    chart(dates) {
        return controller.chart(dates);
    }
}