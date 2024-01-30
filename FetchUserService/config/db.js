
const MongoClient = require('mongodb').MongoClient;
const mongoConnString = require('./params');

const microservice_db =mongoConnString.mongodb_localhost;


async function getMongoConnections(url, db) {
  return new Promise((resolve) => {
    MongoClient.connect(url, function(err, client) {
      if (err) {
        console.error(err);
        return resolve(false);
      } else {
        return resolve(client.db(db));
      }
    });
  });
}
// module.exports.MongoDB = new MongoDB();
module.exports.connect = async function () {
  let dbs = {};
  dbs.microservice_db = await getMongoConnections(`${microservice_db}`, 'microservice_db');
  return dbs;
};

