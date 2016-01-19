const uuid = require('node-uuid');
const config = require('../config');
const Model = require('./Model');

function Player(gameServer, owner) {
  Model.apply(this, Array.prototype.slice.call(arguments));

  this.id = uuid.v4().replace(/-/g, '');
  this.owner = owner;
  this.ownerId = owner.pId;
  this.position = getRandomPosition();
  this.gameServer = gameServer;
  this.health = this.maxHealth = gameServer.gameMode.baseHealth;
  this.radius = 30;
  this.speed = 3;
  this.acceleration = 0.01;
  this._baseFriction = 0.2;
  this.__friction = this._baseFriction;
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

Player.prototype.calculateNextPosition = function () {
  if (typeof this.owner.target.x !== 'undefined' && typeof this.owner.target.y !== 'undefined') {
    calculatePosition.call(this);
  }
}

function calculatePosition() {
  if (!arePositionsApproximatelyEqual(this.position, this.owner.target)) {
    if (this.__friction < 1) {
      this.__friction += this.acceleration;
    }
    
    var speed = this.speed * this.__friction;
    var vX = this.owner.target.x - this.position.x;
    var vY = this.owner.target.y - this.position.y;
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

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function arePositionsApproximatelyEqual(positionA, positionB) {
  var errorMargin = 5;
  return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}