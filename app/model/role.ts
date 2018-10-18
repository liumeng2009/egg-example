'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;
    const Role = app.model.define('role', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING(100), required: true},
        remark: {type: STRING(300)},
        status: INTEGER,
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return Role;
};
