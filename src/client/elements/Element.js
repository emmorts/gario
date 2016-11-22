const EventEmitter = require('common/EventEmitter');
const Logger = require('client/Logger');
class Element {
  constructor() {
    EventEmitter.attach(this);
  }

  bind() {
     Loggger.getInstance().error(`Bind is not implemented in ${this.constructor.name}. `);
  }
}

module.exports = Element;