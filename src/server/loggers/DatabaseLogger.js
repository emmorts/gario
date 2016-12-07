const AbstractLogger = require('common/loggers/AbstractLogger');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb://localhost:27017/gario`;
const queue = [];

let connectionInitialized = false;
let logCollection = null;
let queueLocked = false;

MongoClient.connect(uri, (err, database) => {
  if (!err) {
    logCollection = database.collection('log');

    queue.forEach(entry => logCollection.insert(entry));
    queue.splice(0, queue.length);

    connectionInitialized = true;
  }

  queueLocked = true;
});


class DatabaseLogger extends AbstractLogger {
  static debug(message) {
    const entry = {
      type: 'debug',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  static log(message) {
    const entry = {
      type: 'log',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  static warn(message) {
    const entry = {
      type: 'warn',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  static error(message) {
    const entry = {
      type: 'error',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  static get name() {
    return 'DatabaseLogger';
  }
}

module.exports = DatabaseLogger;
