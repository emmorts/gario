const Logger = require('client/Logger');
const InputHandler = require('client/InputHandler');

class Camera {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this._followee = null;
    this._scrollBreakpoint = 0.1;
    this._scrollSpeed = 8;
    this._scrollLimit = 200;
    this._offsetX = 0;
    this._offsetY = 0;
    this._directionX = null;
    this._directionY = null;

    this._handleInput();
  }

  get scrollX() {
    if (this._followee) {
      return (this._followee.position.x + this.offsetX) - (this.width / 2);
    }

    return 0;
  }

  get scrollY() {
    if (this._followee) {
      return (this._followee.position.y + this.offsetY) - (this.height / 2);
    }

    return 0;
  }

  get offsetX() {
    return this._offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  set offsetX(value) {
    this._offsetX = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
  }

  set offsetY(value) {
    this._offsetY = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
  }

  get northBreakpoint() {
    return this.height * this._scrollBreakpoint;
  }
  get southBreakpoint() {
    return this.height * (1 - this._scrollBreakpoint);
  }
  get westBreakpoint() {
    return this.width * this._scrollBreakpoint;
  }
  get eastBreakpoint() {
    return this.width * (1 - this._scrollBreakpoint);
  }

  follow(gameObject) {
    if (gameObject) {
      if (gameObject.position) {
        this._followee = gameObject;
      } else {
        Logger.error(`Game object ${this._followee.constructor.name} does not have a position to follow.`);
      }
    }
  }

  update() {
    if (this._directionX) {
      this.offsetX += this._directionX;
    } else {
      this.offsetX = Math.abs(this.offsetX) > this._scrollSpeed
        ? this.offsetX + (Math.sign(this.offsetX) * this._scrollSpeed * -1)
        : 0;
    }

    if (this._directionY) {
      this.offsetY += this._directionY;
    } else {
      this.offsetY = Math.abs(this.offsetY) > this._scrollSpeed
        ? this.offsetY + (Math.sign(this.offsetY) * this._scrollSpeed * -1)
        : 0;
    }
  }

  _handleInput() {
    InputHandler.on('mousemove', (mousePosition) => {
      const diffX = 0
        - (mousePosition.absoluteX <= this.eastBreakpoint) * this._scrollSpeed
        + (mousePosition.absoluteX >= this.westBreakpoint) * this._scrollSpeed;

      const diffY = 0
        - (mousePosition.absoluteY <= this.northBreakpoint) * this._scrollSpeed
        + (mousePosition.absoluteY >= this.southBreakpoint) * this._scrollSpeed;

      this._directionX = diffX;
      this._directionY = diffY;
    });
  }

  // TODO: Implement this, you nig
  // easeInQuad(elapsed, start, end, total) {
  //   return end * (elapsed /= total) * elapsed + start;
  // }
}

module.exports = Camera;
