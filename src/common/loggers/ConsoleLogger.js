const AbstractLogger = require('common/loggers/AbstractLogger');

const isNode = typeof window === 'undefined';

class ConsoleLogger extends AbstractLogger {
  static debug(message) {
    if (isNode) {
      console.log(` [DEBUG] ${message}`);
    } else {
      console.debug(message);
    }
  }

  static log(message) {
    if (isNode) {
      console.log('\x1b[36m', `[INFO] ${message}`, '\x1b[0m');
    } else {
      console.log(message);
    }
  }

  static warn(message) {
    if (isNode) {
      console.log('\x1b[33m', `[WARN] ${message}`, '\x1b[0m');
    } else {
      console.warn(message);
    }
  }

  static error(message) {
    if (isNode) {
      console.log('\x1b[31m', `[ERROR] ${message}`, '\x1b[0m');
    } else {
      console.error(message);
    }
  }

  static get name() {
    return 'ConsoleLogger';
  }
}

module.exports = ConsoleLogger;
