// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Article from '../../../app/controller/article';
import ArticleCategory from '../../../app/controller/articleCategory';
import Auth from '../../../app/controller/auth';
import Channel from '../../../app/controller/channel';
import Home from '../../../app/controller/home';
import Role from '../../../app/controller/role';
import Upload from '../../../app/controller/upload';
import User from '../../../app/controller/user';
import UserAccess from '../../../app/controller/userAccess';

declare module 'egg' {
  interface IController {
    article: Article;
    articleCategory: ArticleCategory;
    auth: Auth;
    channel: Channel;
    home: Home;
    role: Role;
    upload: Upload;
    user: User;
    userAccess: UserAccess;
  }
}
