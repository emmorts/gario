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
  this.speed = 5;
  this.acceleration = 2;
  this.velocity = 0;
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

Player.prototype.calculateNextPosition = function () {
  if (typeof this.owner.target.x !== 'undefined' && typeof this.owner.target.y !== 'undefined') {
    if (this.position.x !== this.owner.target.x || this.position.y !== this.owner.target.y) {
      this.position = calculatePosition.call(this, this.position, this.owner.target, this.speed);
    }
  }
}

function calculatePosition(currentPosition, targetPosition, speed) {
  const vX = targetPosition.x - currentPosition.x;
  const vY = targetPosition.y - currentPosition.y;
  const distance = getHypotenuseLength(vX, vY);
  
  const velX = (vX / distance) * this.speed;
  const velY = (vY / distance) * this.speed;
  
  return {
    x: currentPosition.x + velX,
    y: currentPosition.y + velY
  }
  
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}