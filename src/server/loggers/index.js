const loggers = require('common/loggers').concat([
  require('server/loggers/DatabaseLogger'),
]);

module.exports = loggers;

module.exports.default = loggers[0];

module.exports.get = (loggerName) => {
  const logger = loggers.find(x => x.name.toLowerCase() === loggerName.toLowerCase());
  if (!logger) {
    throw new Error(`Couldn't find a logger ${loggerName}`);
  } else {
    return logger;
  }
};
