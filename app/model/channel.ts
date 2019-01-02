'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;

    const Channel = app.model.define('channel', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING(30), required: true},
        name_en: {type: STRING(30)},
        code: {type: STRING(30)},
        sort: {type: INTEGER},
        status: INTEGER,
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return Channel;
};
