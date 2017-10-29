const Logger = require('client/Logger');
const InputHandler = require('client/InputHandler');
const Point = require('common/structures/Point');

class Camera {
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;

    this._scrollBreakpoint = 0.2;
    this._scrollSpeed = 12;
    this._offsetX = 0;
    this._offsetY = 0;
    this._directionX = null;
    this._directionY = null;
    this._target = null;
    this._isFollowing = false;

    this._handleInput();
  }

  get scrollX() {
    if (this._target && this._isFollowing) {
      return (this._target.position.x + this.offsetX) - (this.width / 2);
    }

    return this.offsetX - this.width / 2;
  }

  get scrollY() {
    if (this._target && this._isFollowing) {
      return (this._target.position.y + this.offsetY) - (this.height / 2);
    }

    return this.offsetY - this.height / 2;
  }

  get offsetX() {
    return this._offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  set offsetX(value) {
    if (this._target) {
      const leftBoundary = this._target.position.x - this.width / 3;
      const rightBoundary = this._target.position.x + this.width / 3;
      this._offsetX = Math.min(rightBoundary, Math.max(leftBoundary, value));
    } else {
      this._offsetY = value;
    }
  }

  set offsetY(value) {
    if (this._target) {
      const topBoundary = this._target.position.y - this.height / 3;
      const bottomBoundary = this._target.position.y + this.height / 3;
      this._offsetY = Math.min(bottomBoundary, Math.max(topBoundary, value));
    } else {
      this._offsetY = value;
    }
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

  target(gameObject) {
    if (gameObject) {
      if (gameObject.position && gameObject.position instanceof Point) {
        this._target = gameObject;
      } else {
        Logger.error(`Game object ${this._target.constructor.name} does not have a position to follow.`);
      }
    }

    return this;
  }

  update() {
    if (this._directionX) {
      this.offsetX += this._directionX;
    }

    if (this._directionY) {
      this.offsetY += this._directionY;
    }
  }

  centerTarget() {
    if (this._target) {
      this.offsetX = this._target.position.x;
      this.offsetY = this._target.position.y;
    }
  }

  lookAt(point) {
    if (point) {
      this.offsetX = point.x;
      this.offsetY = point.y;
    }
  }

  _handleInput() {
    InputHandler.on('mousemove', (mousePosition) => {
      if (!this._isFollowing) {
        const diffX = 0
          - (mousePosition.absoluteX <= this.eastBreakpoint) * this._scrollSpeed
          + (mousePosition.absoluteX >= this.westBreakpoint) * this._scrollSpeed;

        const diffY = 0
          - (mousePosition.absoluteY <= this.northBreakpoint) * this._scrollSpeed
          + (mousePosition.absoluteY >= this.southBreakpoint) * this._scrollSpeed;

        this._directionX = diffX;
        this._directionY = diffY;
      } else {
        this._directionX = 0;
        this._directionY = 0;
      }
    });

    InputHandler.keyDown(InputHandler.key.Y, () => {
      if (this._isFollowing) {
        this.centerTarget();
      } else {
        this._offsetX = 0;
        this._offsetY = 0;
      }

      this._isFollowing = !this._isFollowing;
    });

    InputHandler.keyDown(InputHandler.key.SPACE, () => {
      this._offsetX = 0;
      this._offsetY = 0;
      this._isFollowing = true;
    });

    InputHandler.keyUp(InputHandler.key.SPACE, () => {
      this._isFollowing = false;

      this.centerTarget();
    });
  }

  // TODO: Implement this, you nig
  // easeInQuad(elapsed, start, end, total) {
  //   return end * (elapsed /= total) * elapsed + start;
  // }
}

module.exports = Camera;
