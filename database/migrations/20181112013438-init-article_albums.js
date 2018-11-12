'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING,BOOLEAN}=Sequelize;

      return queryInterface.createTable('article_albums',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true,comment:'自增主键'},
          articleId:{type:INTEGER,allowNull:false,comment:'图片所属文章id'},
          thumb_path:{type:STRING(255),comment:'缩略图路径'},
          origin_path:{type:STRING(255),allowNull:false,comment:'原图路径'},
          remark:{type:STRING(50)},
          status:{type:INTEGER,defaultValue:1},
          createdAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
          updatedAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
