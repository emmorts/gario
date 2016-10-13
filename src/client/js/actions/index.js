const OPCode = require('shared/opCode');

module.exports = {
  [OPCode.ADD_PLAYER]: require('actions/AddPlayer'),
  [OPCode.CAST_SPELL]: require('actions/CastSpell'),
  [OPCode.SPAWN_PLAYER]: require('actions/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('actions/UpdateSpells'),
  [OPCode.PLAYER_MOVE]: require('actions/PlayerMove'),
};