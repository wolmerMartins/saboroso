const moment = require('moment');

const db = require('./db');
const Utils = require('./utils');
const Pagination = require('./Pagination');

let pag = null;


const setDateFilter = dates => {
    if (
        Utils.isEmptyJson(dates)
        || (!dates.start && !dates.end)
    ) return '';

    const { start, end } = dates;

    if (!start) return `WHERE date <= '${moment(end).format('YYYY-MM-DD')}'`;
    if (!end) return `WHERE date >= '${moment(start).format('YYYY-MM-DD')}'`;

    return `WHERE date BETWEEN '${moment(start).format('YYYY-MM-DD')}'
        AND '${moment(end).format('YYYY-MM-DD')}'`;
};

module.exports = {
    render(req, res, page, title, h1, bg, message, error) {
        res.render(page, {
            title: `${title} | Restaurante Saboroso`,
            background: `images/img_bg_${bg}.jpg`,
            body: req.body,
            message,
            error,
            h1
        });
    },
    save(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${dbObj.table} (${dbObj.fields}) VALUES (${dbObj.columns})`,
                dbObj.values, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    },
    update(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${dbObj.table} SET ${dbObj.update} WHERE id = ${dbObj.id}`,
                dbObj.values, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
        });
    },
    delete(dbObj) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${dbObj.table} WHERE id = ?`, [dbObj.id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    login(body) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tb_users WHERE email = ?', [ body.email ], (err, results) => {
                if (err) return reject(err);
                if (!results.length) return reject(new Error('Usuário ou senha incorretos'));

                let row = results[0];

                if (row.password !== body.password) return reject(new Error('Usuário ou senha incorretos'));
                resolve(row);
            });
        });
    },
    getData(table, orderBy, page, perPage, dateStart, dateEnd) {
        if (!pag) pag = new Pagination({ table, orderBy });

        return pag.getPage(page, perPage, dateStart, dateEnd);
    },
    chart(dates) {
        const dateFilter = setDateFilter(dates);

        return new Promise((resolve, reject) => {
            db.query(`SELECT CONCAT(YEAR(date),'-',MONTH(date)) AS date, COUNT(*) AS total,
                SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations ${dateFilter}
                GROUP BY CONCAT(YEAR(date),'-',MONTH(date))
                ORDER BY CONCAT(YEAR(date),'-',MONTH(date)) DESC`,
                [], (err, results) => {
                    if (err) return reject(err);

                    const months = [];
                    const values = [];
                    const resultsLimit = results.length;

                    for (let result = 0; result < resultsLimit; result++) {
                        months.push(moment(results[result].date).format('MMM-YYYY'));
                        values.push(results[result].total);
                    }

                    resolve({ months, values });
                });
        });
    }
}
