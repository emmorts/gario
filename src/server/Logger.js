const config = require('server/config');
const Logger = require('common/loggers').get(config.logger);

let instance = null;

class LoggerSingleton extends Logger {
  constructor() {
    super();
  }

  static getInstance() {
    if (!instance) {
      instance = new LoggerSingleton();
    }

    return instance;
  }
}

module.exports = LoggerSingleton;