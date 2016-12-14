const AbstractLogger = require('common/loggers/AbstractLogger');

class NullLogger extends AbstractLogger {
  get name() {
    return 'NullLogger';
  }

  _log() {}
}

module.exports = NullLogger;
