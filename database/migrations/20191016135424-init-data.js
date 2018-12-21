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
            isAdmin:true,
        }
    ])

    // 初始化权限操作
      const menuOp = await queryInterface.bulkInsert('auth_operates',[
          {
              name: '显示',
              code: 'menu',
          }
      ],{});
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
      const auditingOp = await queryInterface.bulkInsert('auth_operates',[
          {
              name: '审核',
              code: 'auditing',
          }
      ],{})


    //初始化权限
    const authFunc = await queryInterface.bulkInsert('auth_functions',[
        {
            name: '用户权限管理',
            code: 'auth',
            level: 0,
            belong: null,
            sort: 1,
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
            level: 1,
            belong: authFunc,
            sort: 2,
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
          level: 1,
          belong: authFunc,
          sort: 3,
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
      const authInRoleFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '权限分配',
              code: 'authInRole',
              level: 1,
              belong: authFunc,
              sort: 4,
          }
      ],{})
      const authInRoleList = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:authInRoleFunc,
          }
      ],{});
      const authInRoleAdd = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:authInRoleFunc,
          }
      ],{});
      const authInRoleDelete = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:authInRoleFunc,
          }
      ],{});

      const cmsFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '网站内容管理',
              code: 'content',
              level: 0,
              belong: null,
              sort: 5,
          }
      ],{})
      const cmsMenu = await queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:cmsFunc,
          }
      ],{});

      const articleFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '内容管理',
              code: 'article',
              level: 1,
              belong: cmsFunc,
              sort: 6,
          }
      ],{})
      const articleMenu = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:articleFunc,
          }
      ],{});
      const articleList = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:articleFunc,
          }
      ],{});
      const articleAdd = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:articleFunc,
          }
      ],{});
      const articleEdit = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:articleFunc,
          }
      ],{});
      const articleDelete = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:articleFunc,
          }
      ],{});
      const articleAuditing = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:auditingOp,
              funcId:articleFunc,
          }
      ],{});

      const articleCategoryFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '栏目类别',
              code: 'category',
              level: 1,
              belong: cmsFunc,
              sort: 7,
          }
      ],{})
      const articleCategoryMenu = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:articleCategoryFunc,
          }
      ],{});
      const articleCategoryList = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:articleCategoryFunc,
          }
      ],{});
      const articleCategoryAdd = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:articleCategoryFunc,
          }
      ],{});
      const articleCategoryEdit = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:articleCategoryFunc,
          }
      ],{});
      const articleCategoryDelete = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:articleCategoryFunc,
          }
      ],{});

      const elasticFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '全文检索管理',
              code: 'elastic',
              level: 1,
              belong: cmsFunc,
              sort: 8,
          }
      ],{})
      const elasticMenu = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:elasticFunc,
          }
      ],{});
      const elasticList = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:elasticFunc,
          }
      ],{});
      const elasticAdd = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:addOp,
              funcId:elasticFunc,
          }
      ],{});
      const elasticEdit = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:elasticFunc,
          }
      ],{});
      const elasticDelete = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:deleteOp,
              funcId:elasticFunc,
          }
      ],{});

      const settingFunc = await queryInterface.bulkInsert('auth_functions',[
          {
              name: '系统管理',
              code: 'system',
              level: 0,
              belong: null,
              sort: 9,
          }
      ],{});
      const settingMenu = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:menuOp,
              funcId:settingFunc,
          }
      ],{});
      const settingList = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:listOp,
              funcId:settingFunc,
          }
      ],{});
      const settingEdit = await  queryInterface.bulkInsert('auth_opInFuncs',[
          {
              opId:editOp,
              funcId:settingFunc,
          }
      ],{});

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
        {roleId:roleResult, authId:authInRoleList,},
        {roleId:roleResult, authId:authInRoleAdd,},
        {roleId:roleResult, authId:authInRoleDelete,},
        {roleId:roleResult, authId:cmsMenu,},
        {roleId:roleResult, authId:articleMenu,},
        {roleId:roleResult, authId:articleList,},
        {roleId:roleResult, authId:articleAdd,},
        {roleId:roleResult, authId:articleEdit,},
        {roleId:roleResult, authId:articleDelete,},
        {roleId:roleResult, authId:articleAuditing,},
        {roleId:roleResult, authId:articleCategoryMenu,},
        {roleId:roleResult, authId:articleCategoryList,},
        {roleId:roleResult, authId:articleCategoryAdd,},
        {roleId:roleResult, authId:articleCategoryEdit,},
        {roleId:roleResult, authId:articleCategoryDelete,},
        {roleId:roleResult, authId:elasticAdd,},
        {roleId:roleResult, authId:elasticMenu,},
        {roleId:roleResult, authId:elasticList,},
        {roleId:roleResult, authId:elasticEdit,},
        {roleId:roleResult, authId:elasticDelete,},
        {roleId:roleResult, authId:settingList,},
        {roleId:roleResult, authId:settingEdit,},
        {roleId:roleResult, authId:settingMenu,},
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
