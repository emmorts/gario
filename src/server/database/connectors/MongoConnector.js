const config = require('server/config');
const MongoClient = require('mongodb').MongoClient;

class MongoConnector {
  constructor(databaseConfig) {
    this.database = null;
    this.connectionInitialized = false;

    this._connect(databaseConfig);
  }

  _connect(databaseConfig) {
    MongoClient.connect(databaseConfig.host, (err, database) => {
      if (!err) {
        this.connectionInitialized = true;
        this.database = database;
      }
    });
  }
}

module.exports = new MongoConnector(config.database);
