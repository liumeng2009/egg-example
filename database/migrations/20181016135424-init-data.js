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
        {name:'管理员1',remark:'次要权限1'},
        {name:'管理员2',remark:'次要权限2'},
        {name:'管理员3',remark:'次要权限3'},
        {name:'管理员4',remark:'次要权限4'},
        {name:'管理员5',remark:'次要权限5'},
        {name:'管理员6',remark:'次要权限6'},
        {name:'管理员7',remark:'次要权限7'},
        {name:'管理员8',remark:'次要权限8'},
        {name:'管理员9',remark:'次要权限9'},
        {name:'管理员10',remark:'次要权限10'},
        {name:'管理员11',remark:'次要权限1'},
        {name:'管理员12',remark:'次要权限2'},
        {name:'管理员13',remark:'次要权限3'},
        {name:'管理员14',remark:'次要权限4'},
        {name:'管理员15',remark:'次要权限5'},
        {name:'管理员16',remark:'次要权限6'},
        {name:'管理员17',remark:'次要权限7'},
        {name:'管理员18',remark:'次要权限8'},
        {name:'管理员19',remark:'次要权限9'},
        {name:'管理员20',remark:'次要权限10'}
    ],{});

    console.log(roleResult);

    const adminPassword='admin';
    // 加密密码
    // const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, 10);

    await queryInterface.bulkInsert('users',[
        {
          mobile:'15822927208',
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
