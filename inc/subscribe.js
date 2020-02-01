const Utils = require('./utils');
const controller = require('./controller');

const TABLE = 'tb_emails';
const FIELDS = ['email'];

module.exports = {
    save(body) {
        return new Promise((resolve, reject) => {
            if (!Utils.isValidEmail(body.email)) return reject({
                error: true,
                message: 'Favor informar um endereco de e-mail válido'
            });

            const dbObj = Utils.setDBObject(Utils.getSaveType(), TABLE, FIELDS, body);

            controller.save(dbObj)
                .then(results => resolve({
                    results,
                    message: 'Seu cadastro foi realizado com sucesso!'
                })).catch(err => reject({
                        error: true,
                        errorMessage: err,
                        message: 'Ocorreu um erro ao cadastrar'
                    }));
            ;
        });
    }
};
