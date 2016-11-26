const AbstractLogger = require('common/loggers/AbstractLogger');

class NullLogger extends AbstractLogger {
  static debug() {}
  static log() {}
  static warn() {}
  static error() {}

  static get name() {
    return 'NullLogger';
  }
}

module.exports = NullLogger;
