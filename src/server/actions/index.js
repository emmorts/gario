const OPCode = require('common/opCode');

module.exports = {
  [OPCode.SPAWN_PLAYER]: require('server/actions/SpawnPlayer'),
  [OPCode.ADD_PLAYER]: require('server/actions/AddPlayer'),
  [OPCode.COLLISION]: require('server/actions/Collision'),
  [OPCode.PLAYER_MOVE]: require('server/actions/PlayerMove'),
  [OPCode.CAST_SPELL]: require('server/actions/CastSpell'),
  [OPCode.UPDATE_PLAYERS]: require('server/actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('server/actions/UpdateSpells'),
};