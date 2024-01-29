class AuthHandler {
  constructor() {}

  getOauth(token) {
    return new Promise(async function (resolve, reject) {
      global.sql.query("SELECT * FROM user_session_storage where access_token ='" + token + "' ", function (error, results, fields) {
        if (error) resolve({status : false});
        if (results == undefined || (Array.isArray(results) && results.length == 0)) {
          resolve({status : false});
        } else {
          const user_info = atob(token);
         // console.log(results);
         resolve(
          {
            status : true,
            user:user_info
          });
        }
      });
      
      //resolve({user:user_info});
      //console.log(user_info);
    });
  }

 }

 module.exports = new AuthHandler();