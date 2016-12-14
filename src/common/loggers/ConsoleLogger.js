const AbstractLogger = require('common/loggers/AbstractLogger');
const LogLevel = require('common/loggers/LogLevel');

const isNode = typeof window === 'undefined';

class ConsoleLogger extends AbstractLogger {
  get name() {
    return 'ConsoleLogger';
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
    if (isNode) {
      console.log(` [TRACE] ${message}`);
    } else {
      console.debug(message);
    }
  }

  _info(message) {
    if (isNode) {
      console.log('\x1b[36m', `[INFO] ${message}`, '\x1b[0m');
    } else {
      console.log(message);
    }
  }

  _warn(message) {
    if (isNode) {
      console.log('\x1b[33m', `[WARN] ${message}`, '\x1b[0m');
    } else {
      console.warn(message);
    }
  }

  _error(message) {
    if (isNode) {
      console.log('\x1b[31m', `[ERROR] ${message}`, '\x1b[0m');
    } else {
      console.error(message);
    }
  }
}

module.exports = ConsoleLogger;
