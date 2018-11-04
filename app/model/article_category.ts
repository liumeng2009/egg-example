'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;

    const ArticleCategory = app.model.define('article_category', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING(30), required: true},
        code: {type: STRING(30)},
        channelId: {type: INTEGER, required: true},
        parentId: {type: INTEGER},
        parent_list: {type: STRING(30)},
        level: {type: INTEGER, required: true},
        sort: {type: INTEGER},
        status: INTEGER,
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return ArticleCategory;
};
