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
  this.speed = 200;
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

Player.prototype.calculateNextPosition = function () {
  if (this.position.x !== this.owner.target.x || this.position.y !== this.owner.target.y) {
    this.position = calculatePosition(this.position, this.owner.target, this.speed);
  }
}

function calculatePosition(currentPosition, targetPosition, speed) {
  // k = (targetPosition.y - currentPosition.y) / (targetPosition.x - currentPosition.x);
  // b = currentPosition.y - k * currentPosition.x;
  const vX = targetPosition.x - currentPosition.x;
  const vY = targetPosition.y - currentPosition.y;
  const k  = speed / (Math.abs(vX) + Math.abs(vY));
  
  let targetX = currentPosition.x + k * vX;
  let targetY = currentPosition.y + k * vY;
  
  if (vX < targetX - currentPosition.x) targetX = targetPosition.x;
  if (vY < targetY - currentPosition.y) targetY = targetPosition.y;
  
  return {
    x: targetX,
    y: targetY
  }
  
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}