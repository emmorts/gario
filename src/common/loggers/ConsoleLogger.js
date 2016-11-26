const AbstractLogger = require('common/loggers/AbstractLogger');

const isNode = typeof window === 'undefined';

class ConsoleLogger extends AbstractLogger {
  static debug(message) {
    if (isNode) {
      console.log(`[DEBUG] ${message}`);
    } else {
      console.debug(message);
    }
  }

  static log(message) {
    if (isNode) {
      console.log(`[INFO] ${message}`);
    } else {
      console.log(message);
    }
  }

  static warn(message) {
    if (isNode) {
      console.log(`[WARN] ${message}`);
    } else {
      console.warn(message);
    }
  }

  static error(message) {
    if (isNode) {
      console.log(`[ERROR] ${message}`);
    } else {
      console.error(message);
    }
  }

  static get name() {
    return 'ConsoleLogger';
  }
}

module.exports = ConsoleLogger;
