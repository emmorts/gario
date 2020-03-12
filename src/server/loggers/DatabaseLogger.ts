import AbstractLogger from 'common/loggers/AbstractLogger';
import LogRepository from 'server/database/repositories/LogRepository';
import { LogLevel } from 'common/loggers/LogLevel';

export default class DatabaseLogger extends AbstractLogger {
  get name() {
    return 'DatabaseLogger';
  }

  _log(message: string, severity: LogLevel) {
    switch (severity) {
      case LogLevel.TRACE:
        this._trace(message);
        break;
      case LogLevel.INFO:
        this._info(message);
        break;
      case LogLevel.WARN:
        this._warn(message);
        break;
      case LogLevel.ERROR:
        this._error(message);
        break;
    }
  }

  _trace(message: string) {
    const entry = {
      type: 'trace',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }

  _info(message: string) {
    const entry = {
      type: 'info',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }

  _warn(message: string) {
    const entry = {
      type: 'warn',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }

  _error(message: string) {
    const entry = {
      type: 'error',
      createdOn: Date.now(),
      message,
    };

    LogRepository.insert(entry);
  }
}
