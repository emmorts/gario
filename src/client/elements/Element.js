const EventEmitter = require('common/EventEmitter');
const Logger = require('client/Logger');

class Element {
  constructor() {
    EventEmitter.attach(this);
  }

  bind() {
    Logger.error(`Bind is not implemented in ${this.constructor.name}.`);
  }
}

module.exports = Element;
