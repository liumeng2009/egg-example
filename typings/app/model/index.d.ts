// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import AuthAuthInRole from '../../../app/model/auth_authInRole';
import AuthFunction from '../../../app/model/auth_function';
import AuthOperate from '../../../app/model/auth_operate';
import AuthOpInFunc from '../../../app/model/auth_opInFunc';
import Role from '../../../app/model/role';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    AuthAuthInRole: ReturnType<typeof AuthAuthInRole>;
    AuthFunction: ReturnType<typeof AuthFunction>;
    AuthOperate: ReturnType<typeof AuthOperate>;
    AuthOpInFunc: ReturnType<typeof AuthOpInFunc>;
    Role: ReturnType<typeof Role>;
    User: ReturnType<typeof User>;
  }
}
