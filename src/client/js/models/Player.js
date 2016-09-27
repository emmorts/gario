export default class Player {
  constructor(playerModel) {
    playerModel = playerModel || {};
    
    this.id = playerModel.id || -1;
    this.ownerId = playerModel.ownerId || -1;
    this.name = playerModel.name;
    this.health = playerModel.health;
    this.maxHealth = playerModel.maxHealth;
    this.speed = 3;
    this.acceleration = 0.1;
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
    this._maxRadius = 25;
    this._rotationTicks = this._baseRotationTicks;
    this._castTicks = this._baseCastTicks;
    this._friction = this._baseFriction;
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
  
  calculateNextPosition(deltaT) {
    if (typeof this.target.x !== 'undefined' && typeof this.target.y !== 'undefined') {
      this._calculatePosition(deltaT);
    }
    if (typeof this.targetRotation !== 'undefined') {
      this._calculateRotation(deltaT);
    }
    if (this._animateCast) {
      this._updateAnimation();
    }
  }
  
  setTarget(target) {
    this.target = {
      x: target.x,
      y: target.y
    };
    
    this.targetRotation = Math.atan2(target.y - this.position.y, target.x - this.position.x);
    var diff = Math.abs(this.targetRotation - this.rotation);
    
    if (diff > Math.PI / 2) {
      this._friction = this._baseFriction;
    }
  }
  
  onCast(spell) {
    this._animateCast = true;
    this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
  }
  
  _calculatePosition(deltaT) {
    if (!this._arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
      if (this._friction < 1) {
        this._friction += this.acceleration;
      }
      
      var speed = this.speed * this._friction;
      var velX = this.velocity.x;
      var velY = this.velocity.y;
      var velocity = 0, fn;
      
      if (!this.stunned) {
        var vX = this.target.x - this.position.x;
        var vY = this.target.y - this.position.y;
        var distance = this._getHypotenuseLength(vX, vY);
        
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
        this.stunned--;
      }
    } else {
      this._friction = this._baseFriction;
      this.velocity = { x: 0, y: 0 };
    }
  }
  
  _calculateRotation(deltaT) {
    if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
      if (this._rotationTicks > 0) {
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
  
  _updateAnimation() {
    if (this._castTicks > 0) {
      var sign = Math.sign(this._castTicks - this._baseCastTicks / 2);
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
  
  _arePositionsApproximatelyEqual(positionA, positionB) {
    var errorMargin = 5;
    return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
  }
}