const routeHandler = require('./handlers/route-handler');

class Routes {
  constructor(app) {
    this.app = app;
    this.createLogMiddleware;
  }
  




  /* creating app Routes starts */
  appRoutes() {
    this.app.post('/searchuser',routeHandler.searchUsersHandler)
    this.app.get('*',routeHandler.routeNotFoundHandler);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
