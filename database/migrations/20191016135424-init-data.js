'use strict';
const bcrypt=require('bcryptjs');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    // 初始化角色
    const roleResult = await queryInterface.bulkInsert('roles',[
        {name:'系统管理员',remark:'最高权限'},
        {name:'管理员',remark:'次要权限'},
    ],{});
    // 初始化系统管理员
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

    // 初始化权限操作
    const listOp = await queryInterface.bulkInsert('auth_operates',[
      {
          name: '查看',
          code: 'list',
      }
    ],{})
    const addOp = await queryInterface.bulkInsert('auth_operates',[
      {
          name: '新增',
          code: 'add',
      }
    ],{})
    const editOp = await queryInterface.bulkInsert('auth_operates',[
      {
          name: '编辑',
          code: 'edit',
      }
    ],{})
    const deleteOp = await queryInterface.bulkInsert('auth_operates',[
      {
          name: '删除',
          code: 'delete',
      }
    ],{})
    const menuOp = await queryInterface.bulkInsert('auth_operates',[
      {
          name: '菜单可见',
          code: 'menu',
      }
    ],{})

    //初始化权限
    const authFunc = await queryInterface.bulkInsert('auth_functions',[
        {
            name: '用户权限管理',
            code: 'auth',
            class: 0,
            belong: null,
        }
    ],{})
    const authMenu = await queryInterface.bulkInsert('auth_opInFuncs',[
        {
            opId:menuOp,
            funcId:authFunc,
        }
    ],{})


    const userFunc = await queryInterface.bulkInsert('auth_functions',[
        {
            name: '用户管理',
            code: 'user',
            class: 1,
            belong: authFunc,
        }
    ],{})
      const userMenu = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:userFunc,
          }
      ],{})
      const userList = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:userFunc,
          }
      ],{})
      const userAdd = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:userFunc,
          }
      ],{})
      const userEdit = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:userFunc,
          }
      ],{})
      const userDelete = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:userFunc,
          }
      ],{})
    const roleFunc = await queryInterface.bulkInsert('auth_functions',[
      {
          name: '角色管理',
          code: 'role',
          class: 1,
          belong: authFunc,
      }
    ],{})
      const roleMenu = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:roleFunc,
          }
      ],{})
      const roleList = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:roleFunc,
          }
      ],{})
      const roleAdd = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:roleFunc,
          }
      ],{})
      const roleEdit = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:roleFunc,
          }
      ],{})
      const roleDelete = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:roleFunc,
          }
      ],{})

    // 所有权限赋值给admin role
    const roleHasAllAuth =  await queryInterface.bulkInsert('auth_authInRoles',[
        {roleId:roleResult, authId:authMenu,},
        {roleId:roleResult, authId:userMenu,},
        {roleId:roleResult, authId:userList,},
        {roleId:roleResult, authId:userAdd,},
        {roleId:roleResult, authId:userEdit,},
        {roleId:roleResult, authId:userDelete,},
        {roleId:roleResult, authId:roleMenu,},
        {roleId:roleResult, authId:roleList,},
        {roleId:roleResult, authId:roleAdd,},
        {roleId:roleResult, authId:roleEdit,},
        {roleId:roleResult, authId:roleDelete,},
    ],{})
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
