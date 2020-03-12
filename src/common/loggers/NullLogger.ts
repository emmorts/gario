import AbstractLogger from "./AbstractLogger";

export default class NullLogger extends AbstractLogger {
  get name() {
    return 'NullLogger';
  }

  _log() {}
}
