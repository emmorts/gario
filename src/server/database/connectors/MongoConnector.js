const EventEmitter = require('common/EventEmitter');
const config = require('server/config');
const MongoClient = require('mongodb').MongoClient;

class MongoConnector {
  constructor(databaseConfig) {
    EventEmitter.attach(this);

    this.database = null;
    this._connected = false;

    this._connect(databaseConfig);
  }

  get isConnected() {
    return this._connected;
  }

  _connect(databaseConfig) {
    MongoClient.connect(databaseConfig.host, (err, database) => {
      if (!err) {
        this._connected = true;
        this.database = database;

        this.fire('connected');
      }
    });
  }
}

module.exports = new MongoConnector(config.database);
