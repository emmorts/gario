const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.CAST_SPELL, {
  type: 'uint8',
  playerX: 'uint16le',
  playerY: 'uint16le',
  x: 'uint16le',
  y: 'uint16le',
});