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
    getReservations() {
        return controller.getData(TABLE, 'date');
    },
    save(body) {
        let dbObj = {};
        if (~body.date.indexOf('/')) body.date = Utils.formatUSDateToDB(body.date);

        if (body.id) {
            dbObj = Utils.setDBObject(Utils.getUpdateType(), TABLE, body);
            return controller.update(dbObj);
        }
        
        dbObj = Utils.setDBObject(Utils.getSaveType(), TABLE, FIELDS, body);
        return controller.save(dbObj);
    },
    delete(id) {
        return controller.delete({ table: TABLE, id });
    }
}