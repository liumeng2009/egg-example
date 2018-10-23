'use strict';
const bcrypt=require('bcryptjs');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const roleResult = await queryInterface.bulkInsert('roles',[
        {name:'系统管理员',remark:'最高权限'},
        {name:'管理员',remark:'次要权限'},
    ],{});

    const adminPassword='admin';
    // 加密密码
    const hash = bcrypt.hashSync(adminPassword, 10);

    await queryInterface.bulkInsert('users',[
        {
            mobile:'admin',
            realname:'刘孟',
            password:hash,
            roleId:roleResult,
        }
    ])

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
