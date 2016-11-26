const EventEmitter = require('common/EventEmitter');

let instance = null;

class InputHandler {
  constructor(window) {
    EventEmitter.attach(this);

    window.addEventListener('mousemove', e => this.fire('mousemove', e));

    window.document.addEventListener('mousedown', () => this.fire('click'));
    window.document.addEventListener('keydown', e => this.fire(e.keyCode));
  }

  static get instance() {
    if (!instance) {
      instance = new InputHandler();

      return instance;
    }

    return instance;
  }
}

module.exports = InputHandler;
