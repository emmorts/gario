const ConsoleLogger = require('common/loggers/ConsoleLogger');
const NullLogger = require('common/loggers/NullLogger');

module.exports.get = (loggerName) => {
  switch(loggerName.toLowerCase()) {
    case ('consolelogger'):
      return ConsoleLogger;
      break;
    case ('nulllogger'):
      return NullLogger;
      break;
    default:
      throw new Error();
  }
};