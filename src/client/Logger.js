const config = require('client/config');
const Loggers = require('common/loggers');
const LogLevel = require('common/loggers/LogLevel');

class Logger {
  constructor() {
    this._logger = null;

    if (config && config.loggers && config.loggers.length) {
      config.loggers.reduce((prevLogger, currentLogger) => {
        const loggerName = currentLogger.name.trim();
        const LoggerRef = Loggers.get(loggerName);

        if (LoggerRef) {
          const logger = new LoggerRef(currentLogger.severity);

          if (prevLogger) {
            prevLogger.setNext(logger);
          } else {
            this._logger = logger;
          }

          return logger;
        }

        throw new Error(`Unable to fetch logger '${loggerName}'.`);
      }, null);
    }
  }

  trace(message) {
    if (this._logger) {
      this._logger.log(message, LogLevel.TRACE);
    }
  }

  info(message) {
    if (this._logger) {
      this._logger.log(message, LogLevel.INFO);
    }
  }

  warn(message) {
    if (this._logger) {
      this._logger.log(message, LogLevel.WARN);
    }
  }

  error(message) {
    if (this._logger) {
      this._logger.log(message, LogLevel.ERROR);
    }
  }
}

module.exports = new Logger();
