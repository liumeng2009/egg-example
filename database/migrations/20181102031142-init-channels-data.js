'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
      //初始化channel数据
      const channelResult = await queryInterface.bulkInsert('channels',[
          {name:'新闻资讯',name_en:'news',code:'new',sort:1},
          {name:'视频专区',name_en:'video',code:'video',sort:2},
          {name:'图片分享',name_en:'photo',code:'photo',sort:3},
          {name:'下载专区',name_en:'download',code:'down',sort:4},
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
