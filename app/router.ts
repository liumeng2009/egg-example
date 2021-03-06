import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/api/login', controller.userAccess.login);
  router.get('/api/user/checktoken', controller.userAccess.checkToken);

  router.get('/api/user', controller.user.index);
  router.post('/api/user/delete', controller.user.destroy);
  router.post('/api/user', controller.user.create);
  router.put('/api/user', controller.user.update);
  router.put('/api/user/changepassword', controller.user.changePassword);
  router.get('/api/user/show/own', controller.user.showOwn);
  router.get('/api/user/:id', controller.user.show);

  router.get('/api/avatar', controller.user.sysAvatar);

  router.post('/api/upload/multiple', controller.upload.multiple);
  router.post('/api/upload', controller.upload.create);

  router.get('/api/role', controller.role.index);
  router.post('/api/role/delete', controller.role.destroy);
  router.get('/api/role/:id', controller.role.show);
  router.post('/api/role', controller.role.create);
  router.put('/api/role', controller.role.update);

  router.post('/api/checkauth', controller.auth.check);
  router.get('/api/auth/:roleId', controller.auth.index);
  router.post('/api/auth', controller.auth.create);
  router.delete('/api/auth/:roleId/:authId', controller.auth.destroy);

  router.get('/api/content/channel', controller.channel.index);
  router.get('/api/content/channel/:id', controller.channel.show);

  router.get('/api/content/category', controller.articleCategory.index);
  router.post('/api/content/category', controller.articleCategory.create);
  router.post('/api/content/category/delete', controller.articleCategory.destroy);
  router.get('/api/content/category/:id', controller.articleCategory.show);
  router.put('/api/content/category', controller.articleCategory.update);

  router.get('/api/content/article', controller.article.index);
  router.post('/api/content/article/delete', controller.article.destroy);
  router.post('/api/content/article/auditing', controller.article.auditing);
  router.get('/api/content/article/:id', controller.article.show);
  router.post('/api/content/article', controller.article.create);
  router.put('/api/content/article', controller.article.update);

  router.get('/api/content/file', controller.file.index);

  router.post('/api/elastic', controller.elastic.create);
  router.get('/api/elastic/createAll', controller.elastic.createAll);
  router.post('/api/elastic/delete', controller.elastic.destroy);
  router.get('/api/elastic/:id', controller.elastic.show);
  router.get('/api/elastic', controller.elastic.search);

  router.get('/api/public/article', controller.article.publicIndex);
  router.get('/api/public/article/:id', controller.article.publicShow);
};
