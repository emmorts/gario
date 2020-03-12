import { LogLevel } from "common/loggers/LogLevel";
import { ServerConfiguration } from "./configuration";
import { GameModeType } from 'server/gamemodes/GameModeType';

export default <ServerConfiguration>{
  port: 3000,
  wsPort: 3001,
  separateSocketServer: true,
  gameWidth: 1000,
  gameHeight: 1000,
  maxConnections: 255,
  defaultGameMode: GameModeType.FFA,
  database: {
    type: 'MONGODB',
    host: 'mongodb://localhost:27017/',
    database: 'gario'
  },
  loggers: [{
    name: 'ConsoleLogger',
    severity: LogLevel.ALL ^ LogLevel.TRACE,
  }, {
    name: 'DatabaseLogger',
    severity: LogLevel.INFO | LogLevel.WARN | LogLevel.ERROR,
  }],
};
