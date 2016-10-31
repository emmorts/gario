const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.ADD_PLAYER, {
  id: 'string',
  ownerId: 'string',
  name: 'string',
  health: 'uint16le',
  maxHealth: 'uint16le',
  x: 'float32le',
  y: 'float32le',
  r: 'uint8',
  g: 'uint8',
  b: 'uint8',
}, player => ({
  id: player.id,
  ownerId: player.ownerId,
  name: player.name,
  health: player.health,
  maxHealth: player.maxHealth,
  position: { x: player.x, y: player.y },
  color: { r: player.r, g: player.g, b: player.b },
}));
