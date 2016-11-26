const EventEmitter = require('common/EventEmitter');
const KeyCode = require('client/util/KeyCode');
const Logger = require('client/Logger');

let instance = null;

class InputHandler {
  constructor(window) {
    if (!instance) {
      instance = this._instantiate(window);
    }

    return instance;
  }

  get key() {
    return KeyCode;
  }

  attachCamera(camera) {
    if (!camera) {
      Logger.warn(`Failed to attach camera, null provided.`);
    } else {
      this.camera = camera;
    }
  }

  _instantiate(window) {
    this.mousePosition = { x: 0, y: 0 };

    EventEmitter.attach(this);

    window.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.x;
      this.mousePosition.y = e.y;

      this.fire('mousemove', this._getPosition());
    });

    window.document.addEventListener('mousedown', e => this.fire(e.button, this._getPosition()));
    window.document.addEventListener('keydown', e => this.fire(e.keyCode, this._getPosition()));

    return this;
  }

  _getPosition() {
    return {
      x: this.mousePosition.x + (this.camera ? this.camera.scrollX : 0),
      y: this.mousePosition.y + (this.camera ? this.camera.scrollY : 0),
      absoluteX: this.mousePosition.x,
      absoluteY: this.mousePosition.y,
    };
  }
}

module.exports = new InputHandler(window);
