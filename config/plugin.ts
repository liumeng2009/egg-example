import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    bcrypt: {
        enable: true,
        package: 'egg-bcrypt',
    },
    i18n : {
        enable: true,
        package: 'egg-i18n',
    },
};

export default plugin;
