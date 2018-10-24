'use strict'

module.exports = (app) => {
    const {INTEGER, DATE} = app.Sequelize;
    const AuthAuthInRole = app.model.define('auth_authInRole', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        authId: {type: INTEGER, required: true},
        roleId: {type: INTEGER, required: true},
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return AuthAuthInRole;
};