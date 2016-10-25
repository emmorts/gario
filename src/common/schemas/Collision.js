const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.COLLISION, {
  actorId: 'string',
  colliderId: 'string'
});
