const uuid = require('node-uuid');
const config = require('../config');
const Model = require('./model');

function Player(gameServer, owner, options) {
  Model.apply(this, Array.prototype.slice.call(arguments));

  options = options || {};

  this.id = uuid.v4().replace(/-/g, '');
  this.owner = owner;
  this.position = options.position || getRandomPosition();
  this.gameServer = gameServer;
  this.speed = 10;
  this.acceleration = 2;
  this.velocity = 0;
  this.frictionIncrement = 0.1;
  this.friction = this.frictionIncrement;
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

Player.prototype.calculateNextPosition = function () {
  if (typeof this.owner.target.x !== 'undefined' && typeof this.owner.target.y !== 'undefined') {
    if (!arePositionsApproximatelyEqual(this.position, this.owner.target)) {
      if (this.friction < 1) {
        this.friction += this.frictionIncrement;
      }
      this.position = calculatePosition.call(this, this.position, this.owner.target);
    } else {
      this.friction = this.frictionIncrement;
    }
  }
}

function calculatePosition(currentPosition, targetPosition) {
  const vX = targetPosition.x - currentPosition.x;
  const vY = targetPosition.y - currentPosition.y;
  const distance = getHypotenuseLength(vX, vY);
  const speed = this.speed * this.friction;
  
  const velX = (vX / distance) * speed;
  const velY = (vY / distance) * speed;
  
  return {
    x: currentPosition.x + velX,
    y: currentPosition.y + velY
  }
  
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function arePositionsApproximatelyEqual(positionA, positionB) {
  const errorMargin = 5;
  return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}