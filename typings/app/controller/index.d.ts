// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Article from '../../../app/controller/article';
import ArticleAlbum from '../../../app/controller/article_album';
import ArticleCategory from '../../../app/controller/article_category';
import Auth from '../../../app/controller/auth';
import Channel from '../../../app/controller/channel';
import Elastic from '../../../app/controller/elastic';
import File from '../../../app/controller/file';
import Home from '../../../app/controller/home';
import Role from '../../../app/controller/role';
import Upload from '../../../app/controller/upload';
import User from '../../../app/controller/user';
import UserAccess from '../../../app/controller/userAccess';

declare module 'egg' {
  interface IController {
    article: Article;
    articleAlbum: ArticleAlbum;
    articleCategory: ArticleCategory;
    auth: Auth;
    channel: Channel;
    elastic: Elastic;
    file: File;
    home: Home;
    role: Role;
    upload: Upload;
    user: User;
    userAccess: UserAccess;
  }
}
