const OPCode = require('common/opCode');

class Camera {
  constructor(renderer) {
    this.renderer = renderer;

    this._followee = null;
    this._scrollSpeed = 4;
    this._scrollLimit = 200;
    this._offsetX = 0;
    this._offsetY = 0;
  }

  get scrollX() {
    if (this._followee) {
      return (this._followee.position.x + this.offsetX) - (this.renderer.width / 2);
    }

    return 0;
  }

  get scrollY() {
    if (this._followee) {
      return (this._followee.position.y + this.offsetY) - (this.renderer.height / 2);
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

  follow(gameObject) {
    if (gameObject) {
      if (gameObject.position) {
        this._followee = gameObject;
      } else {
        console.error(`Game object ${this._followee.constructor.name} does not have a position to follow.`);
      }
    }
  }

  update(direction) {
    switch (direction) {
      case OPCode.DIRECTION_NWEST:
        this.offsetX -= this._scrollSpeed;
        this.offsetY -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_NEAST:
        this.offsetX += this._scrollSpeed;
        this.offsetY -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SWEST:
        this.offsetX -= this._scrollSpeed;
        this.offsetY += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SEAST:
        this.offsetX += this._scrollSpeed;
        this.offsetY += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_WEST:
        this.offsetX -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_EAST:
        this.offsetX += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_NORTH:
        this.offsetY -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SOUTH:
        this.offsetY += this._scrollSpeed;
        break;
      default:
        if (Math.abs(this.offsetX) > this._scrollSpeed) {
          this.offsetX += Math.sign(this.offsetX) * this._scrollSpeed * -1;
        } else {
          this.offsetX = 0;
        }
        if (Math.abs(this.offsetY) > this._scrollSpeed) {
          this.offsetY += Math.sign(this.offsetY) * this._scrollSpeed * -1;
        } else {
          this.offsetY = 0;
        }
    }
  }

  // TODO: Implement this, you nig
  // easeInQuad(elapsed, start, end, total) {
  //   return end * (elapsed /= total) * elapsed + start;
  // }
}

module.exports = Camera;
