const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.PING, {
  timestamp: 'string'
}, object => ({
  timestamp: Number(object.timestamp)
}));
