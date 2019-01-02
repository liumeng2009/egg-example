'use strict'

module.exports = (app) => {
    const {STRING, INTEGER, DATE, TEXT, BOOLEAN} = app.Sequelize;

    const Article = app.model.define('article', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        channelId: {type: INTEGER, required: true},
        categoryId: {type: INTEGER, required: true},
        title: {type: STRING(100)},
        title_en: {type: STRING(100)},
        code: {type: STRING(50)},
        imgUrl: {type: STRING(255)},
        zhaiyao: {type: STRING(255)},
        zhaiyao_en: {type: STRING(255)},
        content: {type: TEXT},
        content_en: {type: TEXT},
        sort: {type: INTEGER},
        click: {type: INTEGER},
        status: {type: INTEGER},
        isComment: {type: BOOLEAN},
        isTop: {type: BOOLEAN},
        isRed: {type: BOOLEAN},
        isHot: {type: BOOLEAN},
        isSlide: {type: BOOLEAN},
        author: {type: INTEGER},
        auditing: {type: INTEGER},
        publishAt: {type: DATE},
        createdAt: {type: DATE},
        updatedAt: {type: DATE},
        isElastic: {type: BOOLEAN},
        isElasticEn: {type: BOOLEAN},
    }, {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return Article;
};
