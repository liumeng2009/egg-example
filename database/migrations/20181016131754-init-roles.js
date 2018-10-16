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

    //return Promise.all([
        return queryInterface.createTable('roles',{
            id:{type:INTEGER,primaryKey:true,autoIncrement:true},
            name:{type:STRING(100),unique:true},
            remark:{type:STRING(300)},
            status:{type:INTEGER,defaultValue:1},
            createdAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
            updatedAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
        })
    //        ,


    //    queryInterface.bulkInsert('roles',[{
    //        name:'系统管理员',
    //        remark:'系统最高权限',
    //    }],{}),
    //]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('users');
  }
};
