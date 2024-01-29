class AuthHandler {
  constructor() {}

  getOauth(token) {
    return new Promise(async function (resolve, reject) {
      global.sql.query("SELECT * FROM user_session_storage where access_token ='" + token + "' ", function (error, results, fields) {
        if (error) resolve({status : false});
        console.log(error)
        if (results == undefined || (Array.isArray(results) && results.length == 0)) {
          resolve({status : false});
        } else {
         // console.log(results);
         resolve({status : true});
        }
      });
    });
  }

 }

 module.exports = new AuthHandler();