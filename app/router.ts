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
  router.get('/api/user/:id', controller.user.show);

  router.get('/api/avatar', controller.user.sysAvatar);

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

  router.get('/api/content/article', controller.article.index);
  router.post('/api/content/article', controller.article.create);
};
