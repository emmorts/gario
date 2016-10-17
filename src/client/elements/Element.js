const EventEmitter = require('EventEmitter');

class Element extends EventEmitter {
  constructor() {
    super();
  }

  bind() {
    console.error(`Bind is not implemented in ${this.constructor.name}. `);
  }
}

module.exports = Element;