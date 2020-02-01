const moment = require('moment');

const COMMA = ',';
const SAVE = 'save';
const UPDATE = 'update';
const INTERROGATION_MARK = '?';
const DATE_TO_DB = 'YYYY-MM-DD';
const DATE_TO_VIEW = 'DD/MM/YYYY';
const CONFIRM_PASSWORD = 'passwordConfirm';

class Utils {
    static setFieldsToUpdate(fields) {
        let update = [];
        
        for (let field in fields) {
            if (field === CONFIRM_PASSWORD) continue;
            if (fields[field]) update.push(`${field} = ${INTERROGATION_MARK}`);
        }

        return update.join(COMMA);
    }

    static setColumns(fields) {
        let columns = [];
        fields.map(field => columns.push(INTERROGATION_MARK));
        return columns.join(COMMA);
    }

    static setValuesToPersist(body) {
        let values = [];
        Object.keys(body).map(key => (body[key] && key !== CONFIRM_PASSWORD) ? values.push(body[key]) : '');
        return values;
    }

    static getUpdateType() {
        return UPDATE;
    }

    static getSaveType() {
        return SAVE;
    }

    static setDBObject(type, table, fields, body) {
        if (type === Utils.getSaveType()) {
            return {
                table,
                fields: fields.join(COMMA),
                values: Utils.setValuesToPersist(body),
                columns: Utils.setColumns(fields)
            }
        } else if (type === Utils.getUpdateType()) {
            const id = fields.id;
            delete fields.id;
            
            return {
                id,
                table,
                update: Utils.setFieldsToUpdate(fields),
                values: Utils.setValuesToPersist(fields)
            }
        }
    }

    static formatDateToBD(date) {
        return moment(date).format(DATE_TO_DB);
    }

    static formatDateToView(date) {
        return moment(date).format(DATE_TO_VIEW);
    }

    static isValidEmail(email) {
        return /[a-z0-9_.]+@([a-z]+\.)[a-z{2,}]+(\.([a-z]{2}))?$/.test(email);
    }
}

module.exports = Utils;
