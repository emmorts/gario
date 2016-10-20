const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.PLAYER_MOVE, {
  x: 'uint16le',
  y: 'uint16le'
});