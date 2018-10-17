// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Role from '../../../app/model/role';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    Role: ReturnType<typeof Role>;
    User: ReturnType<typeof User>;
  }
}
