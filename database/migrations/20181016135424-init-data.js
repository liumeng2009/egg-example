'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    console.log(queryInterface.bulkInsert('roles',[{name:'123',remark:'123'}]))
    const roleResult = await queryInterface.bulkInsert('roles',[{name:'456',remark:'456'}],{});

    console.log(roleResult);

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
