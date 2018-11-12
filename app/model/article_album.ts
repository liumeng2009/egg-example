'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;

    const ArticleAlbum = app.model.define('article_album', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        articleId: {type: INTEGER, required: true},
        origin_path: {type: STRING(255), required: true},
        thumb_path: {type: STRING(255)},
        status: {type: INTEGER},
        remark: {type: STRING(50)},
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return ArticleAlbum;
};