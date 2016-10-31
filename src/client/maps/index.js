const OPCode = require('common/opCode');

module.exports = {
  [OPCode.MAP_ARENA]: require('client/maps/ArenaMap'),
};
