const GameObject = require('common/GameObject');

class Player extends GameObject {
  constructor() {
    super();

    this.maxHealth = 0;
    this.speed = 3;
    this.acceleration = 0.1;
    this.rotation = 0;
    this.targetRotation = 0;
    this.radius = 20;
    this.mass = 20;
    this.stunned = 0;
    this.damageMod = 1;
    this.knockbackMod = 1;
    this.velocity = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this._health = 0;
    this._baseFriction = 0.2;
    this._baseRotationTicks = 10;
    this._baseCastTicks = 10;
    this._baseRadius = this.radius;
    this._maxRadius = 25;
    this._rotationTicks = this._baseRotationTicks;
    this._castTicks = this._baseCastTicks;
    this._friction = this._baseFriction;
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = Math.max(value, 0);
  }

  update(deltaT) {
    if (typeof this.target.x !== 'undefined' && typeof this.target.y !== 'undefined') {
      this._calculatePosition(deltaT);
    }
    if (typeof this.targetRotation !== 'undefined') {
      this._calculateRotation(deltaT);
    }
  }

  setTarget(target) {
    this.target = {
      x: target.x,
      y: target.y,
    };

    this.targetRotation = Math.atan2(target.y - this.position.y, target.x - this.position.x);

    const diff = Math.abs(this.targetRotation - this.rotation);

    if (diff > Math.PI / 2) {
      this._friction = this._baseFriction;
    }
  }

  _calculatePosition() {
    if (!Player._arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
      if (this._friction < 1) {
        this._friction += this.acceleration;
      }

      const speed = this.speed * this._friction;
      let velX = this.velocity.x;
      let velY = this.velocity.y;
      let velocity = 0;
      let fn;

      if (!this.stunned) {
        const vX = this.target.x - this.position.x;
        const vY = this.target.y - this.position.y;
        const distance = Player._getHypotenuseLength(vX, vY);

        velX = (vX / distance) * speed;
        velY = (vY / distance) * speed;
      }

      if (Math.abs(this.velocity.x - velX) > this.acceleration) {
        velocity = this.acceleration * Math.sign(velX);
        fn = Math.sign(velX) !== 1 ? Math.max : Math.min;
        this.velocity.x = fn(this.velocity.x + velocity, Math.sign(velX) * speed);
      } else {
        this.velocity.x = velX;
      }

      if (Math.abs(this.velocity.y - velY) > this.acceleration) {
        velocity = this.acceleration * Math.sign(velY);
        fn = Math.sign(velY) !== 1 ? Math.max : Math.min;
        this.velocity.y = fn(this.velocity.y + velocity, Math.sign(velY) * speed);
      } else {
        this.velocity.y = velY;
      }

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.stunned) {
        this.velocity.x *= (1 - this.acceleration);
        this.velocity.y *= (1 - this.acceleration);
        this.target.x = this.position.x;
        this.target.y = this.position.y;
        this.stunned -= 1;
      }
    } else {
      this._friction = this._baseFriction;
      this.velocity = { x: 0, y: 0 };
    }
  }

  _calculateRotation() {
    if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
      if (this._rotationTicks > 0) {
        if (this.rotation > Math.PI) {
          this.rotation = -Math.PI - (Math.PI - Math.abs(this.rotation));
        } else if (this.rotation < -Math.PI) {
          this.rotation = Math.PI + (Math.PI - Math.abs(this.rotation));
        }
        if (Math.abs(this.targetRotation - this.rotation) > Math.PI) {
          const diffA = Math.PI - Math.abs(this.rotation);
          const diffB = Math.PI - Math.abs(this.targetRotation);
          const diff = diffA + diffB;
          if (this.rotation > 0) {
            this.rotation += diff / this._rotationTicks;
          } else {
            this.rotation -= diff / this._rotationTicks;
          }
        } else {
          this.rotation += (this.targetRotation - this.rotation) / this._rotationTicks;
        }
      } else {
        this.rotation = this.targetRotation;
        this._rotationTicks = this._baseRotationTicks;
      }
    }
  }

  static _getHypotenuseLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  static _arePositionsApproximatelyEqual(positionA, positionB) {
    const errorMargin = 5;

    const isHorizontalPositionEqual = Math.abs(positionA.x - positionB.x) < errorMargin;
    const isVerticalPositionEqual = Math.abs(positionA.y - positionB.y) < errorMargin;

    return isHorizontalPositionEqual && isVerticalPositionEqual;
  }

}

module.exports = Player;
