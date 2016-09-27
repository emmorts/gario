const uuid = require('node-uuid');
const config = require('../config');
const Model = require('./Model');

class Player extends Model {

  constructor(gameServer, owner) {
    super();

    this.id = uuid.v4().replace(/-/g, '');
    this.owner = owner;
    this.ownerId = owner.pId;
    this.position = getRandomPosition();
    this.gameServer = gameServer;
    this.health = this.maxHealth = 100;
    this.radius = 30;
    this.speed = 3;
    this.acceleration = 0.01;
    this.color = null;
    this._baseFriction = 0.2;
    this._friction = this._baseFriction;
  }

  setColor(color) {
    this.color = color;
  }

  calculateNextPosition() {
    if (typeof this.owner.target.x !== 'undefined' && typeof this.owner.target.y !== 'undefined') {
      calculatePosition.call(this);
    }
  }

}

module.exports = Player;

function calculatePosition() {
  if (!arePositionsApproximatelyEqual(this.position, this.owner.target)) {
    if (this._friction < 1) {
      this._friction += this.acceleration;
    }
    
    let speed = this.speed * this._friction;
    let vX = this.owner.target.x - this.position.x;
    let vY = this.owner.target.y - this.position.y;
    let distance = getHypotenuseLength(vX, vY);
    
    let velX = (vX / distance) * speed;
    let velY = (vY / distance) * speed;
    
    this.position = {
      x: this.position.x + velX,
      y: this.position.y + velY
    };
  } else {
    this._friction = this._baseFriction;
  }
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function arePositionsApproximatelyEqual(positionA, positionB) {
  const errorMargin = 5;
  const isHorizontallyColliding = Math.abs(positionA.x - positionB.x) < errorMargin; 
  const isVerticallyColliding = Math.abs(positionA.y - positionB.y) < errorMargin;
  return isHorizontallyColliding && isVerticallyColliding;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  };
}