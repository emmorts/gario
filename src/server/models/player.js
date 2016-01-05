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
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

Player.prototype.calculateNextPosition = function () {
  this.position.x = this.owner.mouse.x;
  this.position.y = this.owner.mouse.y;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}