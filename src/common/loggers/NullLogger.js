const AbstractLogger = require('common/loggers/AbstractLogger');

class NullLogger extends AbstractLogger {
  log(message) {
    
  }

  warn(message) {

  }

  error(message) {

  }

}

module.exports = NullLogger;