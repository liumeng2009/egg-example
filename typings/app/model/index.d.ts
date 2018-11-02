// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import ArticleCategory from '../../../app/model/article_category';
import AuthAuthInRole from '../../../app/model/auth_authInRole';
import AuthFunction from '../../../app/model/auth_function';
import AuthOperate from '../../../app/model/auth_operate';
import AuthOpInFunc from '../../../app/model/auth_opInFunc';
import Channel from '../../../app/model/channel';
import Role from '../../../app/model/role';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    ArticleCategory: ReturnType<typeof ArticleCategory>;
    AuthAuthInRole: ReturnType<typeof AuthAuthInRole>;
    AuthFunction: ReturnType<typeof AuthFunction>;
    AuthOperate: ReturnType<typeof AuthOperate>;
    AuthOpInFunc: ReturnType<typeof AuthOpInFunc>;
    Channel: ReturnType<typeof Channel>;
    Role: ReturnType<typeof Role>;
    User: ReturnType<typeof User>;
  }
}
