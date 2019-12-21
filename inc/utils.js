class Utils {
    static setColumns(fields) {
        let columns = [];
        fields.map(field => columns.push('?'));
        return columns.join(',');
    }

    static setValuesToPersist(body) {
        let values = [];
        Object.keys(body).map(key => values.push(body[key]));
        return values;
    }

    static setDBObject(table, fields, body) {
        return {
            table,
            fields: fields.join(','),
            values: Utils.setValuesToPersist(body),
            columns: Utils.setColumns(fields)
        }
    }

    static formatDateToBD(date) {
        let dt = date.split('/');
        return `${dt[2]}-${dt[1]}-${dt[0]}`;
    }

    static formatDateToView(date) {
        let dt = date.split('-');
        return `${dt[2]}/${dt[1]}/${dt[0]}`;
    }
}

module.exports = Utils;
