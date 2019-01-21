'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const {INTEGER,DATE,STRING}=Sequelize;

    return queryInterface.createTable('auth_operates',{
        id:{type:INTEGER,primaryKey:true,autoIncrement:true},
        name:{type:STRING(30),allowNull:false,unique:true},
        name_en:{type:STRING(30),allowNull:false,unique:true},
        code:{type:STRING(30),allowNull:false,unique:true},
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
