'use strict';
const bcrypt=require('bcryptjs');
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const {INTEGER,DATE,STRING}=Sequelize;

    const adminPassword='admin';
    // 加密密码
    //const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, 10);
    console.log('加密密码是：'+hash);
    return Promise.all([
        queryInterface.createTable('users',{
            id:{type:INTEGER,primaryKey:true,autoIncrement:true},
            mobile:{type:STRING(30),allowNull:false},
            realname:{type:STRING(30)},
            password:{type:STRING(200),allowNull:false},
            age:INTEGER,
            status:{type:INTEGER,defaultValue:1},
            token:{type:STRING(500)},
            createdAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
            updatedAt:{type:DATE,defaultValue: Sequelize.fn('CURRENT_TIMESTAMP')},
        }),


        queryInterface.bulkInsert('users',[{
            mobile:'15822927208',
            password:hash,
        }],{}),
    ]);
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
