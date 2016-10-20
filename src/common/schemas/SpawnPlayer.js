const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.SPAWN_PLAYER, {
  name: { type: 'string' }
}, obj => obj.name || '');