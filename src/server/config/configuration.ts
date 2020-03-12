import { LogLevel } from "common/loggers/LogLevel"
import { GameModeType } from 'server/gamemodes/GameModeType';

export interface ServerConfiguration {
  port: number;
  wsPort: number;
  separateSocketServer: boolean;
  gameWidth: number;
  gameHeight: number;
  maxConnections: number;
  defaultGameMode: GameModeType;
  database: DatabaseConfiguration;
  loggers: LoggerConfiguration[];
};

export interface DatabaseConfiguration {
  type: string;
  host: string;
  database: string;
}

export interface LoggerConfiguration {
  name: string;
  severity: LogLevel;
}