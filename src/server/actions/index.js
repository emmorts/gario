const OPCode = require('../../opCode');

module.exports = {
  [OPCode.SPAWN_PLAYER]: require('actions/SpawnPlayer'),
  [OPCode.ADD_PLAYER]: require('actions/AddPlayer'),
  [OPCode.CAST_SPELL]: require('actions/CastSpell'),
  [OPCode.UPDATE_PLAYERS]: require('actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('actions/UpdateSpells'),
};