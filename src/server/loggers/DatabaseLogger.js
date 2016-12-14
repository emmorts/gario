const config = require('server/config');
const AbstractLogger = require('common/loggers/AbstractLogger');
const LogLevel = require('common/loggers/LogLevel');
const MongoClient = require('mongodb').MongoClient;

const queue = [];

let connectionInitialized = false;
let logCollection = null;
let queueLocked = false;

MongoClient.connect(config.database, (err, database) => {
  if (!err) {
    logCollection = database.collection('log');

    queue.forEach(entry => logCollection.insert(entry));
    queue.splice(0, queue.length);

    connectionInitialized = true;
  }

  queueLocked = true;
});


class DatabaseLogger extends AbstractLogger {
  get name() {
    return 'DatabaseLogger';
  }

  _log(message, severity) {
    switch (severity) {
      case LogLevel.TRACE:
        this._trace(message);
        break;
      case LogLevel.INFO:
        this._info(message);
        break;
      case LogLevel.WARN:
        this._warn(message);
        break;
      case LogLevel.ERROR:
        this._error(message);
        break;
      default:
    }
  }

  _trace(message) {
    const entry = {
      type: 'trace',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  _info(message) {
    const entry = {
      type: 'info',
      createdOn: Date.now(),
      message,
    };

    if (connectionInitialized) {
      logCollection.insert(entry);
    } else if (!queueLocked) {
      queue.push(entry);
    }
  }

  _warn(message) {
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

  _error(message) {
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
}

module.exports = DatabaseLogger;
