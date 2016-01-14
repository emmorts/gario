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
}

module.exports = Player;

Player.prototype = new Model();

Player.prototype.setColor = function (color) {
  this.color = color;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * config.gameWidth),
    y: Math.floor(Math.random() * config.gameHeight)
  }
}