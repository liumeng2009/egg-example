import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  //router.resources('users', '/api/users', controller.user);

  router.post('/api/login', controller.userAccess.login);
  router.get('/api/user/checktoken', controller.userAccess.checkToken);

  router.get('/api/user', controller.user.index);
  router.post('/api/user', controller.user.create);
  router.put('/api/user', controller.user.update);
  router.get('/api/user/:id', controller.user.show);
  router.delete('/api/user/:id', controller.user.destroy);

  router.get('/api/avatar', controller.user.sysAvatar);

  router.post('/api/upload', controller.upload.create);

  router.get('/api/role', controller.role.index);
  router.get('/api/role/:id', controller.role.show);
  router.post('/api/role', controller.role.create);
  router.put('/api/role', controller.role.update);
  router.delete('/api/role/:id', controller.role.destroy);
};
