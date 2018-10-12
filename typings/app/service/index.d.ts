// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import ActionToken from '../../../app/service/actionToken';
import Test from '../../../app/service/Test';
import User from '../../../app/service/user';
import UserAccess from '../../../app/service/userAccess';

declare module 'egg' {
  interface IService {
    actionToken: ActionToken;
    test: Test;
    user: User;
    userAccess: UserAccess;
  }
}
