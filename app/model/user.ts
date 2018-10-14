'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;

    const User = app.model.define('user', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        mobile: {type: STRING(30), required: true},
        realname: {type: STRING(30)},
        password: {type: STRING(200), required: true},
        age: INTEGER,
        status: INTEGER,
        token: STRING(500),
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return User;
};
