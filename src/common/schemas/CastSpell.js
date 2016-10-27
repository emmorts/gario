const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.CAST_SPELL, {
  type: 'uint8',
  playerX: 'int16le',
  playerY: 'int16le',
  x: 'int16le',
  y: 'int16le',
});