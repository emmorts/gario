const AbstractLogger = require('common/loggers/AbstractLogger');
const LogLevel = require('common/loggers/LogLevel');
const LogRepository = require('server/database/repositories/LogRepository');

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

    LogRepository.insert(entry);
  }

  _info(message) {
    const entry = {
      type: 'info',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }

  _warn(message) {
    const entry = {
      type: 'warn',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }

  _error(message) {
    const entry = {
      type: 'error',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }
}

module.exports = DatabaseLogger;
