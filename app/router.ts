import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.resources('users', '/api/users', controller.user);

  router.post('/api/login', controller.userAccess.login);
  router.get('/api/user/checktoken', controller.userAccess.checkToken);
};
