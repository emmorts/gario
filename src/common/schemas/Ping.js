const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.PING, {
  timestamp: 'string'
}, object => ({
  timestamp: Number(object.timestamp)
}));
