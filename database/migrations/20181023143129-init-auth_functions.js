'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const {INTEGER,DATE,STRING}=Sequelize;

    return queryInterface.createTable('auth_functions',{
        id:{type:INTEGER,primaryKey:true,autoIncrement:true},
        name:{type:STRING(30),allowNull:false,unique:true},
        name_en:{type:STRING(30),allowNull:false,unique:true},
        code:{type:STRING(30),allowNull:false,unique:true},
        level: {type:INTEGER,allowNull:false},
        belong: {type:INTEGER},
        sort: {type:INTEGER},
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
