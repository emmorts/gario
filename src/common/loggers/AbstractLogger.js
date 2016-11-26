class AbstractLogger {
  static debug() {
    throw new Error(`debug() must be overriden in ${this.constructor.name}`);
  }

  static log() {
    throw new Error(`log() must be overriden in ${this.constructor.name}`);
  }

  static warn() {
    throw new Error(`warn() must be overriden in ${this.constructor.name}`);
  }

  static error() {
    throw new Error(`error() must be overriden in ${this.constructor.name}`);
  }
}

module.exports = AbstractLogger;
