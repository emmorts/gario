function Player(playerModel) {
  playerModel = playerModel || {};
  
  this.id = playerModel.id || -1;
  this.ownerId = playerModel.ownerId || -1;
  this.name = playerModel.name;
  this.health = playerModel.health;
  this.maxHealth = playerModel.maxHealth;
  this.speed = 6;
  this.acceleration = 0.01;
  this.rotation = 0;
  this.targetRotation = 0;
  this._baseFriction = 0.2;
  this._baseRotationTicks = 10;
  this.__rotationTicks = this._baseRotationTicks;
  this.__friction = this._baseFriction;
  
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
}

Player.prototype.setTarget = function (x, y) {
  this.targetRotation = Math.atan2(y - this.position.y, x - this.position.x);
  var diff = this.targetRotation - this.rotation;
  
  if (diff > Math.PI / 2) {
    this.__friction = this._baseFriction;
  }
  
  this.target.x = x;
  this.target.y = y;
}

module.exports = Player;

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
      this.__rotationTicks = 10
    }
  }
}

function calculatePosition() {
  if (!arePositionsApproximatelyEqual(this.position, this.target)) {
    if (this.__friction < 1) {
      this.__friction += this.acceleration;
    }
    
    var speed = this.speed * this.__friction;
    var vX = this.target.x - this.position.x;
    var vY = this.target.y - this.position.y;
    var distance = getHypotenuseLength(vX, vY);
    
    var velX = (vX / distance) * speed;
    var velY = (vY / distance) * speed;
    
    this.position = {
      x: this.position.x + velX,
      y: this.position.y + velY
    };
  } else {
    this.__friction = this._baseFriction;
  }
}

function getQuadrant(radians) {
  if (radians > 0 && radians < Math.PI / 2) {
    return 4;
  } else if (radians >= Math.PI / 2 && radians < Math.PI) {
    return 3
  } else if (radians < -Math.PI / 2 && radians > -Math.PI) {
    return 2;
  } else if (radians < 0 && radians > -Math.PI / 2) {
    return 1;
  }
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function arePositionsApproximatelyEqual(positionA, positionB) {
  var errorMargin = 5;
  return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
}
