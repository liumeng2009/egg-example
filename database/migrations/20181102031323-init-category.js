'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING,BOOLEAN}=Sequelize;

      return queryInterface.createTable('article_categories',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true,comment:'自增主键'},
          name:{type:STRING(30),allowNull:false,unique:true,comment:'名称'},
          code:{type:STRING(30),allowNull:false,unique:true,comment:'缩写，用于调用'},
          channelId:{type:INTEGER,allowNull:false},
          parentId:{type:INTEGER},
          parent_list:{type:STRING(30),comment:'所属父类别的列表，逗号隔开，有利于树结构排序'},
          level:{type:INTEGER,allowNull:false},
          status:{type:INTEGER,defaultValue:1},
          sort:{type:INTEGER},
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
