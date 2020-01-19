const moment = require('moment');

class Utils {
    static setFieldsToUpdate(fields) {
        let update = [];
        
        for (let field in fields) {
            if (fields[field]) update.push(`${field} = ?`);
        }

        return update.join(',');
    }

    static setColumns(fields) {
        let columns = [];
        fields.map(field => columns.push('?'));
        return columns.join(',');
    }

    static setValuesToPersist(body) {
        let values = [];
        Object.keys(body).map(key => body[key] ? values.push(body[key]) : '');
        return values;
    }

    static getUpdateType() {
        return 'update';
    }

    static getSaveType() {
        return 'save';
    }

    static setDBObject(type, table, fields, body) {
        if (type === Utils.getSaveType()) {
            return {
                table,
                fields: fields.join(','),
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
        return moment(date).format('YYYY-MM-DD');
    }

    static formatDateToView(date) {
        return moment(date).format('DD/MM/YYYY');
    }
}

module.exports = Utils;
