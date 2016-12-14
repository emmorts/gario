const LogLevel = require('common/loggers/LogLevel');

module.exports = {
  port: 3000,
  wsPort: 3001,
  separateSocketServer: true,
  gameWidth: 1000,
  gameHeight: 1000,
  maxConnections: 255,
  defaultGameMode: 0,
  loggers: [{
    name: 'ConsoleLogger',
    severity: LogLevel.ALL,
  }, {
    name: 'DatabaseLogger',
    severity: LogLevel.WARN | LogLevel.ERROR,
  }],
};
