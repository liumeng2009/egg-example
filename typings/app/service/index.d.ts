// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import ActionToken from '../../../app/service/actionToken';
import Article from '../../../app/service/article';
import ArticleAlbum from '../../../app/service/article_album';
import ArticleCategory from '../../../app/service/article_category';
import AuthAuthInRole from '../../../app/service/auth_authInRole';
import AuthFunction from '../../../app/service/auth_function';
import AuthOperate from '../../../app/service/auth_operate';
import AuthOpInFunc from '../../../app/service/auth_opInFunc';
import Channel from '../../../app/service/channel';
import Elasticsearch from '../../../app/service/elasticsearch';
import File from '../../../app/service/file';
import Role from '../../../app/service/role';
import Test from '../../../app/service/Test';
import Upload from '../../../app/service/upload';
import User from '../../../app/service/user';
import UserAccess from '../../../app/service/userAccess';

declare module 'egg' {
  interface IService {
    actionToken: ActionToken;
    article: Article;
    articleAlbum: ArticleAlbum;
    articleCategory: ArticleCategory;
    authAuthInRole: AuthAuthInRole;
    authFunction: AuthFunction;
    authOperate: AuthOperate;
    authOpInFunc: AuthOpInFunc;
    channel: Channel;
    elasticsearch: Elasticsearch;
    file: File;
    role: Role;
    test: Test;
    upload: Upload;
    user: User;
    userAccess: UserAccess;
  }
}
