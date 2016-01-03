let BufferUtil = require('concentrate');
let uuid = require('node-uuid');
let config = require('./config');
let util = require('./util');

function Player() {
  this.id = uuid.v4().replace(/-/g, '');

  this.reset();
}

Player.prototype.reset = function () {
  let radius = util.massToRadius(config.defaultPlayerMass);
  let position = util.randomPosition(radius);

  this.x = position.x;
  this.y = position.y;
  this.massTotal = config.defaultPlayerMass;
  this.hue = Math.round(Math.random() * 360);

  this.cells = [{
    mass: config.defaultPlayerMass,
    x: position.x,
    y: position.y,
    radius: radius
  }];

  return this;
}

Player.prototype.bufferize = function () {
  let buffer = BufferUtil()
    .string(this.id)
    .floatle(this.x)
    .floatle(this.y)
    .uint16le(this.hue)
    .uint16le(this.massTotal)
    .uint8(this.cells.length);

  if (this.cells.length > 0) {
    this.cells.forEach((cell) => {
      buffer
        .uint16le(cell.mass)
        .floatle(cell.x)
        .floatle(cell.y)
        .uint16le(cell.radius);
    });
  }
  
  return buffer.result();
}

Player.prototype.toObject = function () {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    hue: this.hue,
    massTotal: this.massTotal,
    cells: this.cells
  };
}

module.exports = Player;