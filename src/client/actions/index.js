const OPCode = require('common/opCode');

module.exports = {
  [OPCode.ADD_PLAYER]: require('client/actions/AddPlayer'),
  [OPCode.CAST_SPELL]: require('client/actions/CastSpell'),
  [OPCode.COLLISION]: require('client/actions/Collision'),
  [OPCode.SPAWN_PLAYER]: require('client/actions/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('client/actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('client/actions/UpdateSpells'),
  [OPCode.PLAYER_MOVE]: require('client/actions/PlayerMove'),
};