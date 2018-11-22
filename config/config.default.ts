import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539080601714_4183';

  // add your egg config in here
  config.middleware = [
      'errorHandler',
  ];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'database_egg_prod',
    username: 'root',
    password: '357852',
    timezone: '+8:00',
    omitNull: false,
  }

  config.jwt = {
      secret: 'liumeng',
  }

  config.bcrypt = {
    saltRounds: 10,
  }

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [
        'http://127.0.0.1:4200',
        'http://localhost:4200',
    ],
  }

  config.static = {

  }

  config.validate = {
      widelyUndefined : true,
  }

  config.pageSize = 15

  config.sysAvatarPath = appInfo.baseDir + '/app/public/uploads/avatar/dongman'

  config.elasticsearchPath = 'http://localhost:9200/';

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
