class AbstractLogger {
  constructor(mask) {
    this._mask = mask;
    this._next = null;
  }

  setNext(logger) {
    this._next = logger;
    return logger;
  }

  log(message, severity) {
    if ((severity & this._mask) !== 0) {
      this._log(message, severity);
    }

    if (this._next && 'log' in this._next) {
      this._next.log(message, severity);
    }
  }

  _log() {
    throw new Error(`_log() must be overriden in ${this.constructor.name}`);
  }
}

module.exports = AbstractLogger;
