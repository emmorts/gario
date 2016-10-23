const EventEmitter = require('common/EventEmitter');

class Element {
  constructor() {
    EventEmitter.attach(this);
  }

  bind() {
    console.error(`Bind is not implemented in ${this.constructor.name}. `);
  }
}

module.exports = Element;