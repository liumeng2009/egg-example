'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      const {INTEGER,DATE,STRING}=Sequelize;

      return queryInterface.createTable('auth_authInRoles',{
          id:{type:INTEGER,primaryKey:true,autoIncrement:true},
          authId:{type:INTEGER,allowNull:false},
          roleId:{type:INTEGER,allowNull:false},
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
