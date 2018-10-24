'use strict'

module.exports = (app) => {
    const {INTEGER, DATE} = app.Sequelize;
    const AuthOpInFunc = app.model.define('auth_opInFunc', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        opId: {type: INTEGER, required: true},
        funcId: {type: INTEGER, required: true},
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return AuthOpInFunc;
};
