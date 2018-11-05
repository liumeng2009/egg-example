'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING,BOOLEAN,TEXT}=Sequelize;

      return queryInterface.createTable('article_categories',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true,comment:'自增主键'},
          channelId:{type:INTEGER,allowNull:false},
          categoryId:{type:INTEGER,allowNull:false},
          title:{type:STRING(100),allowNull:false},
          imgUrl:{type:STRING(255),comment:'封面图片'},
          zhaiyao:{type:STRING(255),comment:'摘要'},
          content:{type:TEXT},
          sort:{type:INTEGER,defaultValue:100},
          click:{type:INTEGER,defaultValue: 0},
          status:{type:INTEGER,defaultValue:1,comment:'1正常0删除2未审核'},
          isComment:{type:BOOLEAN,defaultValue:true,comment:'是否可以评论'},
          isTop:{type:BOOLEAN,defaultValue:false,comment:'是否置顶'},
          isRed:{type:BOOLEAN,defaultValue:false,comment:'是否推荐'},
          isHot:{type:BOOLEAN,defaultValue:false,comment:'是否热门'},
          isSlide:{type:BOOLEAN,defaultValue:false,comment:'是否设置为幻灯片'},
          author:{type:INTEGER,allowNull:false,comment:'作者'},
          auditing:{type:INTEGER,allowNull:false,comment:'审核者'},
          publishAt: {type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
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
