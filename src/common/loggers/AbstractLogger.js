class AbstractLogger {
  log(message) {
    throw new Error(`log() must be overriden in ${this.constructor.name}`);
  }

  warn(message) {
    throw new Error(`warn() must be overriden in ${this.constructor.name}`);
  }

  error(message) {
    throw new Error(`error() must be overriden in ${this.constructor.name}`);
  }
}

module.exports = AbstractLogger;