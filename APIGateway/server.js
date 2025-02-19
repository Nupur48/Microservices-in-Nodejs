const express = require('express');
const http = require('http');
const AppConfig = require('./config/app-config');


const Routes = require('./routes');

class Server {
  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  /* Including app Routes starts */
  includeRoutes() {
    new Routes(this.app).routesConfig();
  }
  /* Including app Routes ends */

  startTheServer() {
    this.appConfig();
    this.includeRoutes();
    
    (async () => {
      const dbCon = require('./config/db');
      global.dbs = await dbCon.connect();
      global.sql = require('./config/mysql');
    })();

    const port = process.env.NODE_SERVER_POST || 8000;
    const host = process.env.NODE_SERVER_HOST || 'localhost';

    this.http.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
    
  }
}

module.exports = new Server();