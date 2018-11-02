'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING,BOOLEAN}=Sequelize;

      return queryInterface.createTable('channels',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true},
          name:{type:STRING(30),allowNull:false,unique:true},
          code:{type:STRING(30),allowNull:false,unique:true},
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
