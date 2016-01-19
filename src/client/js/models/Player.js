function Player(playerModel) {
  playerModel = playerModel || {};
  
  this.id = playerModel.id || -1;
  this.ownerId = playerModel.ownerId || -1;
  this.name = playerModel.name;
  this.health = playerModel.health;
  this.maxHealth = playerModel.maxHealth;
  this.speed = 3;
  this.acceleration = 0.2;
  this.rotation = 0;
  this.targetRotation = 0;
  this.radius = 20;
  this.mass = 20;
  this.velocity = { x: 0, y: 0 };
  this.stunned = 0;
  this._baseFriction = 0.2;
  this._baseRotationTicks = 10;
  this._baseCastTicks = 10;
  this._baseRadius = this.radius;
  this.__maxRadius = 25;
  this.__rotationTicks = this._baseRotationTicks;
  this.__castTicks = this._baseCastTicks;
  this.__friction = this._baseFriction;
  this.__animateCast = false;
  
  this.color = {
    r: playerModel.r || 0,
    g: playerModel.g | 0,
    b: playerModel.b || 0
  };
  
  this.position = {
    x: playerModel.x || 0,
    y: playerModel.y || 0
  };
  
  this.target = {
    x: playerModel.targetX || playerModel.x || 0,
    y: playerModel.targetY || playerModel.y || 0
  };
}

Player.prototype.calculateNextPosition = function () {
  if (typeof this.target.x !== 'undefined' && typeof this.target.y !== 'undefined') {
    calculatePosition.call(this);
  }
  if (typeof this.targetRotation !== 'undefined') {
    calculateRotation.call(this);
  }
  if (this.__animateCast) {
    updateAnimation.call(this);
  }
}

Player.prototype.onCast = function (spell) {
  this.__animateCast = true;
  this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
}

Player.prototype.setTarget = function (x, y) {
  this.targetRotation = Math.atan2(y - this.position.y, x - this.position.x);
  var diff = Math.abs(this.targetRotation - this.rotation);
  
  if (diff > Math.PI / 2) {
    this.__friction = this._baseFriction;
  }
  
  this.target.x = x;
  this.target.y = y;
}

module.exports = Player;

function calculatePosition() {
  if (!arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
    if (this.__friction < 1) {
      this.__friction += this.acceleration;
    }
    
    var speed = this.speed * this.__friction;
    var velX = this.velocity.x;
    var velY = this.velocity.y;
    var velocity = 0, fn;
    
    if (!this.stunned) {
      var vX = this.target.x - this.position.x;
      var vY = this.target.y - this.position.y;
      var distance = getHypotenuseLength(vX, vY);
      
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
      this.target.x = this.position.x;
      this.target.y = this.position.y;
      this.stunned--;
    }
  } else {
    this.__friction = this._baseFriction;
    this.velocity = { x: 0, y: 0 };
  }
}

function calculateRotation() {
  if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
    if (this.__rotationTicks > 0) {
      if (this.rotation > Math.PI) {
        this.rotation = -Math.PI - (Math.PI - Math.abs(this.rotation));
      } else if (this.rotation < -Math.PI) {
        this.rotation = Math.PI + (Math.PI - Math.abs(this.rotation));
      }
      if (Math.abs(this.targetRotation - this.rotation) > Math.PI) {
        var diffA = Math.PI - Math.abs(this.rotation);
        var diffB = Math.PI - Math.abs(this.targetRotation);
        var diff = diffA + diffB;
        if (this.rotation > 0) {
          this.rotation += diff / this.__rotationTicks;
        } else {
          this.rotation -= diff / this.__rotationTicks;
        }
      } else {
        this.rotation += (this.targetRotation - this.rotation) / this.__rotationTicks;
      }
    } else {
      this.rotation = this.targetRotation;
      this.__rotationTicks = this._baseRotationTicks;
    }
  }
}

function updateAnimation() {
  if (this.__castTicks > 0) {
    var sign = Math.sign(this.__castTicks - this._baseCastTicks / 2);
    this.radius += sign * (this.__maxRadius - this.radius) / 2;
    this.__castTicks--;
  } else {
    this.radius = this._baseRadius;
    this.__castTicks = this._baseCastTicks;
    this.__animateCast = false;
    this.targetRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
  }
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function arePositionsApproximatelyEqual(positionA, positionB) {
  var errorMargin = 5;
  return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
}
