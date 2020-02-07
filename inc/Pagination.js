const db = require('./db');

class Pagination {
    constructor(options) {
        const { table, orderBy } = options;
        
        this._total = 0;
        this._pages = 1;
        this._currentPage = 1;
        
        this.table = table;
        this.orderBy = orderBy;
    }

    getPage(page = 1, perPage = 10) {
        this.currentPage = page;
        const start = (page - 1) * perPage;

        const query = [
            `SELECT SQL_CALC_FOUND_ROWS * FROM ${this.table} ORDER BY ${this.orderBy} LIMIT ?, ?`,
            'SELECT FOUND_ROWS() AS FOUND_ROWS'
        ];
        
        return new Promise((resolve, reject) => {
            db.query(
                query.join(';'),
                [start, perPage],
                (err, results) => {
                    if (err) return reject(err);

                    const [data, rows] = results;
                    const [totalRows] = rows;

                    this.data = data;
                    this.total = totalRows.FOUND_ROWS;
                    this.pages = Math.ceil(this.total / perPage);

                    resolve(this.data);
                }
            );
        });
    }

    get total() {
        return this._total;
    }

    set total(total) {
        this._total = total;
    }

    get pages() {
        return this._pages;
    }

    set pages(pages) {
        this._pages = pages;
    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(currentPage) {
        this._currentPage = currentPage;
    }
}

module.exports = Pagination;
