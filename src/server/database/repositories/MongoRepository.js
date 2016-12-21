const EventEmitter = require('common/EventEmitter');
const MongoConnector = require('server/database/connectors/MongoConnector');
const Repository = require('server/database/repositories/Repository');

class MongoRepository extends Repository {
  constructor(collectionName) {
    super();

    EventEmitter.attach(this);

    this._connector = MongoConnector;
    this._connected = false;

    this._enqueueDatabase(() => {
      this._collection = this._connector.database.collection(collectionName);

      this.fire('connected');
    });
  }

  get isConnected() {
    return this._connected;
  }

  find(criteria, options) {
    return new Promise((resolve, reject) => {
      this._enqueueCollection(() => {
        this._collection.findOne(criteria, options, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  findAll(options) {
    return new Promise((resolve, reject) => {
      this._enqueueCollection(() => {
        this._collection.find(null, options, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  insert(object, options) {
    return new Promise((resolve, reject) => {
      this._enqueueCollection(() => {
        this._collection.insertOne(object, options, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  _enqueueDatabase(operation) {
    if (this._connector.isConnected) {
      operation();
    } else {
      this._connector.once('connected', operation);
    }
  }

  _enqueueCollection(operation) {
    if (this.isConnected) {
      operation();
    } else {
      this.once('connected', operation);
    }
  }
}

module.exports = MongoRepository;
