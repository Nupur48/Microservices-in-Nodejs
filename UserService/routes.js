const routeHandler = require('./handlers/route-handler');

class Routes {
  constructor(app) {
    this.app = app;
    this.createLogMiddleware;
  }
  createLogMiddleware = (req,res,next) => {
    const start = new Date();
    res.on("finish", function() {
    const end = new Date();
    const responseTime = end - start;

    // Log response details, including status code and response time
    console.log(`${end.toLocaleString()} - ${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
      });
      next();
  }




  /* creating app Routes starts */
  appRoutes() {
    this.app.post('/register',this.createLogMiddleware, routeHandler.registerRouteHandler);
    this.app.post('/login', this.createLogMiddleware,routeHandler.loginRouteHandler);
    this.app.get('/user/:userId', this.createLogMiddleware,routeHandler.getUserDetailsHandler);
    this.app.get('*', this.createLogMiddleware,routeHandler.routeNotFoundHandler);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
