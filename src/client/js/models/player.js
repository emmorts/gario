var Player = (function () {

  function Player(node) {
    node = node || {};
    
    this.id = node.id || -1;
    this.name = node.name;
    this.target = { x: 0, y: 0 };
    this.speed = 6;
    this.acceleration = 0.01;
    this.rotation = 0;
    this.targetRotation = 0;
    this.baseFriction = 0.2;
    this.baseRotationTicks = 10;
    this._rotationTicks = this.baseRotationTicks;
    this._friction = this.baseFriction;
    
    this.color = {
      r: node.r || 0,
      g: node.g | 0,
      b: node.b || 0
    };
    
    this.position = {
      x: node.x || 0,
      y: node.y || 0
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
    var vX = x - this.position.x;
    var vY = y - this.position.y;
    this.targetRotation = Math.atan2(vY, vX);
    
    this.target.x = x;
    this.target.y = y;
  }
  
  return Player;
  
  function calculateRotation() {
    if (this.rotation !== this.targetRotation) {
      if (this._rotationTicks > 0) {
        this.rotation += (this.targetRotation - this.rotation) / this._rotationTicks;
      } else {
        this.rotation = this.targetRotation;
        this._rotationTicks = 10
      }
    }
  }

  function calculatePosition() {
    if (!arePositionsApproximatelyEqual(this.position, this.target)) {
      if (this._friction < 1) {
        this._friction += this.acceleration;
      }
      
      var speed = this.speed * this._friction;
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
      this._friction = this.baseFriction;
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
  
})();
