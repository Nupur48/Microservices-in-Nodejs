const httpProxy = require('express-http-proxy');
const AuthHandler = require('./config/oAuth');
const responseTime = require('response-time')

const userServiceProxy = httpProxy('http://localhost:4000');
const productServiceProxy = httpProxy('http://localhost:3000');
const orderServiceProxy = httpProxy('http://localhost:2000');

class Routes {
  constructor(app) {
    this.app = app;
    this.createLogMiddleware.bind(this);
    this.authMiddleware;
  }

  // getServiceName(url) {
  //   console.log(url);
  //   // Implement your logic to extract the service name from the URL
  //   // Example: /getUserDetails/:userId -> userService
  //   // You may need to customize this logic based on your actual service URLs
  //   const serviceNames = [userService, productService, orderService];
  //   for (const serviceName of serviceNames) {
  //     if (url.includes(serviceName)) {
  //       return serviceName;
  //     }
  //   }
  //   return 'unknownService';
  // }



  // Log middleware
  createLogMiddleware = (req,res,next) => {

    const date = new Date();
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    const start = new Date();
    res.on("finish", function() {
    const end = new Date();
    const responseTime = end - start;
    //const serviceName = this.getServiceName(req.url);
    // console.log(serviceName);
    //const stage = params.appDomainURL.includes("staging") ? "Staging" : "Live";
    //const user_id = (req['user_info'] && req['user_info']['user_id'] != undefined) ? Number(req['user_info']['user_id']) : 0;
   // const partner_id = (req['user_info'] && req['user_info']['partner_id'] != undefined) ? Number(req['user_info']['partner_id']) : 0;    
    const req_body = req.body.params ? JSON.stringify(req.body.params).replace(/\\\"/g, '') : req.params ? req.params : req.body;
    const payload = req.method === "GET" ? "no payload" : req.body;
    // let updatelog = ApiTransactionResponseLogsCtrl.ApiTransactionDetails({stage: "local", headers: req.headers,  response_time: parseFloat((time/1000.0).toFixed(2)), method: req.method, req_url: req.url, payload: payload, response: res, created_date: date});
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

    

    // this.app.post('/register',this.authMiddleware,this.createLogMiddleware, (req, res) => {
    //   userServiceProxy(req, res);
    // });

    // this.app.post('/login',this.authMiddleware,this.createLogMiddleware, (req, res) => {
    //   userServiceProxy(req, res);
    // });

    // this.app.get('/product/:productId',this.authMiddleware,this.createLogMiddleware, (req, res) => {
    //   productServiceProxy(req, res);
    // });

    // this.app.get('/product', this.authMiddleware,this.createLogMiddleware,(req, res) => {
    //   productServiceProxy(req, res);
    // });


    // this.app.post('/order',this.authMiddleware,this.createLogMiddleware, (req, res) => {
    //   orderServiceProxy(req, res);
    // });

    // this.app.get('/getorder',this.authMiddleware, this.createLogMiddleware,(req, res) => {
    //   orderServiceProxy(req, res);
    // });
  }

  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
