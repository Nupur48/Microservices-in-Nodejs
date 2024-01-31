/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const bodyParser = require('body-parser');
const cors = require('cors');
var Rollbar = require('rollbar');

class AppConfig {
  constructor(app) {
    process.on('unhandledRejection', (reason, p) => {
     // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
      // application specific logging, throwing an error, or other logic here
    });
    this.rollbar = new Rollbar({
      accessToken: 'c405899287234048b66d4ec306668420',
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        code_version: '1.0.0',
      }
    });
    this.app = app;
  }
  

  includeConfig() {
    this.loadAppLevelConfig();
  
  }

  loadAppLevelConfig() {
    this.app.use(
      bodyParser.json(),
    );
    this.app.use(
      cors(),
    );
    this.app.use(this.rollbar.errorHandler());
    
  }

}
module.exports = AppConfig;
