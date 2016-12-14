const LogLevel = require('common/loggers/LogLevel');

module.exports = {
  protocol: 'ws',
  gameServer: '127.0.0.1:3001',
  loggers: [{
    name: 'ConsoleLogger',
    severity: LogLevel.ALL,
  }],
};
