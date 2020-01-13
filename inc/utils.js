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

    static setDBObject(type, table, fields, body) {
        if (type === 'save') {
            return {
                table,
                fields: fields.join(','),
                values: Utils.setValuesToPersist(body),
                columns: Utils.setColumns(fields)
            }
        } else if (type === 'update') {
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
        let dt = date.split('/');
        return `${dt[2]}-${dt[1]}-${dt[0]}`;
    }

    static formatDateToView(date) {
        let dt = date.split('-');
        return `${dt[2]}/${dt[1]}/${dt[0]}`;
    }
}

module.exports = Utils;
