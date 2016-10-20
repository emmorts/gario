const OPCode = require('common/opCode');

module.exports = {
  [OPCode.MODEL_PLAYER]: require('server/models/Player')
};