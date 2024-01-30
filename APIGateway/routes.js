const httpProxy = require('express-http-proxy');
const AuthHandler = require('./config/oAuth');

const {userServiceUrl,fetchUserServiceUrl} = require('./config/params');
const userServiceProxy = httpProxy(userServiceUrl);
const FetchUserServiceProxy = httpProxy(fetchUserServiceUrl);

class Routes {
  constructor(app) {
    this.app = app;
    this.createLogMiddleware.bind(this);
    this.authMiddleware;
  }



  // Log middleware
  createLogMiddleware = (req,res,next) => {

    const date = new Date();
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    const start = new Date();
    res.on("finish", function() {
    const end = new Date();
    const responseTime = end - start;    
    const req_body = req.body.params ? JSON.stringify(req.body.params).replace(/\\\"/g, '') : req.params ? req.params : req.body;
    const payload = req.method === "GET" ? "no payload" : req.body;
    console.log(({stage: "local", headers: req.headers,response_time: responseTime, method: req.method, req_url: req.url, payload: req.body, response: res.statusCode, created_date: date}));


   });
   next();
  }

  //auth middleware
  authMiddleware(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token !== undefined) {
      if (token.startsWith('Bearer ')) {
        // Extract the token from the 'Bearer ' prefix
        token = token.slice(7, token.length);
  
        AuthHandler.getOauth(token)
          .then(oauthValid => {
            if (!oauthValid['status']) {
              res.status(401).json({ error: "Invalid authorization code" });
              next(); 
            } else {
              //
              console.log(oauthValid['user']);
              res.status(200);
              next();
            }
          })
          .catch(error => {
            res.status(500).json({ error: "Internal Server Error" });
            next();
          });
      } else {
        res.status(401).json({ error: "Unauthorized request" });
        next(); 
      }
    } else {
      res.status(401).json({ error: "Unauthorized request" });
      next(); 
    }
  }





  /* creating app Routes starts */
  appRoutes() {
    this.app.get('/user/:userId',this.authMiddleware, this.createLogMiddleware,(req, res) => {
      userServiceProxy(req, res);
    });
    this.app.get('/searchuser',this.authMiddleware, this.createLogMiddleware,(req, res) => {
      FetchUserServiceProxy(req, res);
    });
  }

  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
