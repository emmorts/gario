import CommonLoggers from 'common/loggers/index';
import DatabaseLogger from 'server/loggers/DatabaseLogger';
import AbstractLogger from 'common/loggers/AbstractLogger';
import { LogLevel } from 'common/loggers/LogLevel';

const loggers: { new(mask: LogLevel): AbstractLogger }[] = []

loggers.push(
  ...CommonLoggers.loggers,
  DatabaseLogger
)

export default {
  loggers,
  getByName: (loggerName: string, logMask: LogLevel): AbstractLogger => {
    const loggerTypeRef = loggers.find(x => x.name.toLowerCase() === loggerName.toLowerCase());
    if (!loggerTypeRef) {
      throw new Error(`Couldn't find a logger ${loggerName}`);
    }

    return new loggerTypeRef(logMask);
  }
}