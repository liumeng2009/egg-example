'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;
    const AuthOperate = app.model.define('auth_operate', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING(30), required: true},
        code: {type: STRING(30), required: true},
        status: INTEGER,
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return AuthOperate;
};
