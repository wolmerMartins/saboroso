const moment = require('moment');

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

    getQueryString({ page, params }) {
        const queryString = [];
        const [start, end] = params ? params : [null, null];
        const query = {
            page,
            start,
            end
        };
        
        for (let name in query) {
            if (query[name]) queryString.push(`${name}=${query[name]}`);
        }

        return queryString.join('&');
    }

    getNavigation(params) {
        const links = [];
        const limitPagesNav = (this.pages < 5) ? this.pages : 5;

        let navStart = 1;
        let navEnd = limitPagesNav;

        if ((this.currentPage - Math.ceil(limitPagesNav / 2)) > 0) {
            if ((this.currentPage + parseInt(limitPagesNav / 2)) > this.pages) {
                navStart = this.pages - (limitPagesNav - 1);
                navEnd = this.pages;
            } else {
                navStart = this.currentPage - parseInt(limitPagesNav / 2);
                navEnd = this.currentPage + parseInt(limitPagesNav / 2);
            }
        }

        if (this.currentPage > 1) {
            links.push({
                text: '<',
                href: `?${this.getQueryString({
                    page: this.currentPage - 1,
                    params
                })}`
            });
        }

        for (let x = navStart; x <= navEnd; x++) {this.currentPage
            links.push({
                text: x,
                href: `?${this.getQueryString({ page: x, params })}`,
                active: (x === this.currentPage)
            });
        }

        if (this.currentPage < this.pages) {
            links.push({
                text: '>',
                href: `?${this.getQueryString({
                    page: this.currentPage + 1,
                    params
                })}`
            });
        }

        return links;
    }

    isEmptyJSON(json) {
        return JSON.stringify(json) === '{}';
    }

    setDateFilterRange(dates, params) {
        const filter = {};

        if (!dates.end) dates.end = moment().format('YYYY-MM-DD');

        filter.query = 'WHERE date BETWEEN ? AND ?';
        params.unshift(dates.start, dates.end);

        return filter;
    }

    setDateFilterUntil(dates, params) {
        const filter = {};

        filter.query = 'WHERE date <= ?';
        params.unshift(dates.end);

        return filter;
    }

    setDates(dateStart, dateEnd) {
        const dates = {};

        if (!dateStart && !dateEnd) return dates;

        if (dateEnd && !dateStart) {
            dates.end = moment(dateEnd).format('YYYY-MM-DD');
        } else if(dateStart && !dateEnd) {
            dates.end = moment().format('YYYY-MM-DD');
            dates.start = moment(dateStart).format('YYYY-MM-DD');
        } else {
            dates.end = moment(dateEnd).format('YYYY-MM-DD');
            dates.start = moment(dateStart).format('YYYY-MM-DD');
        }

        return dates;
    }

    setDateFilter(dateStart, dateEnd, params) {
        const filter = {};
        const dates = this.setDates(dateStart, dateEnd);

        if (this.isEmptyJSON(dates)) return filter;

        if (dates.end && !dates.start) {
            return this.setDateFilterUntil(dates, params);
        } else if (dates.start) {
            return this.setDateFilterRange(dates, params);
        }
    }

    getPage(page = 1, perPage = 10, dateStart, dateEnd) {
        this.currentPage = parseInt(page);
        const start = (page - 1) * perPage;
        const params = [start, perPage];

        const filter = this.setDateFilter(dateStart, dateEnd, params);

        const query = [
            `SELECT SQL_CALC_FOUND_ROWS *
             FROM ${this.table}
             ${(!this.isEmptyJSON(filter))
                ? filter.query
                : ''}
             ORDER BY ${this.orderBy}
             LIMIT ?, ?`,
            'SELECT FOUND_ROWS() AS FOUND_ROWS'
        ];
        
        return new Promise((resolve, reject) => {
            db.query(
                query.join(';'),
                params,
                (err, results) => {
                    if (err) return reject(err);

                    const [data, rows] = results;
                    const [totalRows] = rows;

                    this.data = data;
                    this.total = totalRows.FOUND_ROWS;
                    this.pages = Math.ceil(this.total / perPage);

                    resolve({
                        links: this.getNavigation(!this.isEmptyJSON(filter) ? params : null),
                        data: this.data
                    });
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
