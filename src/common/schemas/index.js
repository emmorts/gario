const OPCode = require('common/opCode');

const schemas = {
  [OPCode.ADD_PLAYER]: require('common/schemas/AddPlayer'),
  [OPCode.CAST_SPELL]: require('common/schemas/CastSpell'),
  [OPCode.COLLISION]: require('common/schemas/Collision'),
  [OPCode.PING]: require('common/schemas/Ping'),
  [OPCode.PONG]: require('common/schemas/Pong'),
  [OPCode.PLAYER_MOVE]: require('common/schemas/PlayerMove'),
  [OPCode.SPAWN_PLAYER]: require('common/schemas/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('common/schemas/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('common/schemas/UpdateSpells'),
};

module.exports.get = opCode => {
  if (opCode in schemas) {
    return schemas[opCode];
  } else {
    console.error(`Unable to find schema for ${OPCode.getName(opCode)}.`);
  }
};