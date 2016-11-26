const config = require('server/config');
const Loggers = require('common/loggers');

let loggerList = [];

if (config.logger) {
  loggerList = config.logger
    .split(',')
    .map(x => Loggers.get(x));
}

module.exports.debug = message => loggerList.forEach(l => l.debug(message));
module.exports.log = message => loggerList.forEach(l => l.log(message));
module.exports.warn = message => loggerList.forEach(l => l.warn(message));
module.exports.error = message => loggerList.forEach(l => l.error(message));
