const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.COLLISION, {
  actorId: 'string',
  colliderId: 'string'
});
