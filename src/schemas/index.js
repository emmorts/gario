const OPCode = require('opCode');

const schemas = {
  [OPCode.ADD_PLAYER]: require('schemas/AddPlayer'),
  [OPCode.CAST_SPELL]: require('schemas/CastSpell'),
  [OPCode.COLLISION]: require('schemas/Collision'),
  [OPCode.PLAYER_MOVE]: require('schemas/PlayerMove'),
  [OPCode.SPAWN_PLAYER]: require('schemas/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('schemas/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('schemas/UpdateSpells'),
};

module.exports.get = opCode => {
  if (opCode in schemas) {
    return schemas[opCode];
  } else {
    console.error(`Unable to find schema for ${OPCode.getName(opCode)}.`);
  }
};