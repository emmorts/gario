const Logger = require('client/Logger');
const Camera = require('client/camera/Camera');

class FollowCamera extends Camera {
  constructor(width = 0, height = 0) {
    super(width, height);

    this._followee = null;
    this._scrollBreakpoint = 0.1;
    this._scrollLimit = 200;
  }

  get scrollX() {
    if (this._followee) {
      return (this._followee.position.x + this.offsetX) - (this.width / 2);
    }

    return this.offsetX - this.width / 2;
  }

  get scrollY() {
    if (this._followee) {
      return (this._followee.position.y + this.offsetY) - (this.height / 2);
    }

    return this.offsetY - this.height / 2;
  }

  set offsetX(value) {
    this._offsetX = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
  }

  set offsetY(value) {
    this._offsetY = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
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

  // TODO: Implement this, you nig
  // easeInQuad(elapsed, start, end, total) {
  //   return end * (elapsed /= total) * elapsed + start;
  // }
}

module.exports = FollowCamera;
