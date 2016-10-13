const OPCode = require('../opCode');

const schemas = {
  [OPCode.ADD_PLAYER]: require('./AddPlayer'),
  [OPCode.CAST_SPELL]: require('./CastSpell'),
  [OPCode.PLAYER_MOVE]: require('./PlayerMove'),
  [OPCode.SPAWN_PLAYER]: require('./SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('./UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('./UpdateSpells'),
};

module.exports.get = opCode => {
  if (opCode in schemas) {
    return schemas[opCode];
  } else {
    console.error(`Unable to find schema for ${OPCode.getName(opCode)}.`);
  }
};