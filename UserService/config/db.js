
const MongoClient = require('mongodb').MongoClient;
const microservice_db = "mongodb://127.0.0.1:27017/";


async function getMongoConnections(url, db) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, client) {
      if (err) {
        console.error(err)
        return resolve(false);
      }
      else {
        return resolve(client.db(db));
      }
    })
  });
}
// module.exports.MongoDB = new MongoDB();
module.exports.connect = async function () {
  let dbs = {};
  dbs.microservice_db = await getMongoConnections(`${microservice_db}`, 'microservice_db');
  return dbs;
};

