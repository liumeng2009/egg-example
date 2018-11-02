'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING,BOOLEAN}=Sequelize;

      return queryInterface.createTable('article_category',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true},
          name:{type:STRING(30),allowNull:false,unique:true},
          code:{type:STRING(30),allowNull:false,unique:true},
          channelId:{type:INTEGER,allowNull:false},
          parentId:{type:INTEGER},
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
