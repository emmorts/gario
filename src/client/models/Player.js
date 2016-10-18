const PlayerBase = require('models/PlayerBase');

export default class Player extends PlayerBase {
  constructor(playerModel = {}) {
    super();

    this.id = playerModel.id || -1;
    this.ownerId = playerModel.ownerId || -1;
    this.name = playerModel.name;
    this.health = playerModel.health;
    this.maxHealth = playerModel.maxHealth;
    this._animateCast = false;
    
    this.color = {
      r: playerModel.color.r || 0,
      g: playerModel.color.g | 0,
      b: playerModel.color.b || 0
    };
    
    this.position = {
      x: playerModel.position.x || 0,
      y: playerModel.position.y || 0
    };
    
    this.target = {
      x: (playerModel.target ? playerModel.target.x : null) || playerModel.position.x || 0,
      y: (playerModel.target ? playerModel.target.y : null) || playerModel.position.y || 0
    };
  }

  update(deltaT) {
    super.update(deltaT);

    if (this._animateCast) {
      this._updateAnimation();
    }    
  }
  
  onCast(spell) {
    this._animateCast = true;
    this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
  }
  
  _updateAnimation() {
    if (this._castTicks > 0) {
      const sign = Math.sign(this._castTicks - this._baseCastTicks / 2);
      this.radius += sign * (this._maxRadius - this.radius) / 4;
      this._castTicks--;
    } else {
      this.radius = this._baseRadius;
      this._castTicks = this._baseCastTicks;
      this._animateCast = false;

      this.targetRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }
  }
  
  _getHypotenuseLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
  
  _arePositionsApproximatelyEqual(positionA, positionB, errorMargin = 5) {
    const isHorizontalPositionEqual = Math.abs(positionA.x - positionB.x) < errorMargin;
    const isVerticalPositionEqual = Math.abs(positionA.y - positionB.y) < errorMargin;

    return isHorizontalPositionEqual && isVerticalPositionEqual;
  }
}