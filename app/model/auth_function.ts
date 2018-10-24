'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;
    const AuthFunction = app.model.define('auth_function', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING(30), required: true},
        code: {type: STRING(30), required: true},
        class: {type: INTEGER, required: true},
        belong: {type: INTEGER},
        status: INTEGER,
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return AuthFunction;
};
