const AbstractLogger = require('common/loggers/AbstractLogger');
const isNode = typeof window === undefined;

class ConsoleLogger extends AbstractLogger {
  log(message) {
    if (!isNode) {
      console.log(`[INFO] ${message}`);
    } else {
      console.log(message);
    }
  }

  warn(message) {
    if (!isNode) {
      console.log(`[WARN] ${message}`);
    } else {
      console.warn(message);
    }
  }

  error(message) {
    if (!isNode) {
      console.log(`[ERROR] ${message}`);
    } else {
      console.error(message);
    }
  }

}

module.exports = ConsoleLogger;