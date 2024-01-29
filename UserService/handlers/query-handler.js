
var ObjectId = require('mongodb').ObjectId;

class QueryHandler {
  constructor() {
    this.collection = "users";
    this.dbName = "microservice_db";
  }

  login(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let that = this;
        let query = {
          name: data.name,
          password:data.password
      }
        global.dbs[that.dbName]
                    .collection(that.collection)
                    .find(query).toArray ((err, result) => {
                        if (err) {
                            resolve({
                                success: false,
                                data: err
                            });
                        } else {
                          resolve({
                            success: true,
                            data: result
                        })
                        }
                    });
      } catch (error) {
        reject(error);
      }
    });
  }


  getUserDetails(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(userId);
        let that = this;
        const db =global.dbs[that.dbName]
          .collection(that.collection).aggregate([
            {
              $match: { _id: ObjectId(userId) },
            },
            {
              $project: {
                name: true,
                email: true,
                lastname: true,
                online: true,
                _id: false,
               id: '$_id',
              },
            },
          ]).toArray((error, result) => {
          if (error) {
            console.log(error)
            reject(error);
          }
          let userDetails = null;
          if (result.length > 0) {
            userDetails = result[0];
          }
          console.log(userDetails);
          resolve(userDetails);
        });
       
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  registerUser(data) {
    return new Promise(async (resolve, reject) => {
      let that = this;
      try {
        global.dbs[that.dbName]
                    .collection(that.collection)
                    .insertOne(data, (err, inserted) => {
                        if (err) {
                            resolve({
                                success: false,
                                data: err
                            });
                        } else {
                            resolve({
                                success: true,
                                data: "User inserted sucessfully",
                                result: inserted
                            });
                        }
                    });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new QueryHandler();
