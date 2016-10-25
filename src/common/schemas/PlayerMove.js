const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.PLAYER_MOVE, {
  x: 'uint16le',
  y: 'uint16le'
});