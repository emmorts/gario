const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.SPAWN_PLAYER, {
  name: { type: 'string' }
}, obj => obj.name || '');