const MongoClient = require('mongodb').MongoClient;

const microservice_db = "mongodb://127.0.0.1:27017/";

async function getMongoConnections(url, db) {
  try {
    console.log(url);
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    return client.db(db);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

module.exports.connect = async function () {
  try {
    const dbs = {};
    dbs.microservice_db = await getMongoConnections(`${microservice_db}`, 'microservice_db');
    return dbs;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

module.exports.close = async function () {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    throw err;
  }
};
