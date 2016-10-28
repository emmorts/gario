const OPCode = require('common/opCode');

module.exports = {
  [OPCode.ADD_PLAYER]: require('server/actions/AddPlayer'),
  [OPCode.CAST_SPELL]: require('server/actions/CastSpell'),
  [OPCode.COLLISION]: require('server/actions/Collision'),
  [OPCode.INITIALIZE_ARENA]: require('server/actions/InitializeArena'),
  [OPCode.PING]: require('server/actions/Ping'),
  [OPCode.PONG]: require('server/actions/Pong'),
  [OPCode.PLAYER_MOVE]: require('server/actions/PlayerMove'),
  [OPCode.SPAWN_PLAYER]: require('server/actions/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('server/actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('server/actions/UpdateSpells'),
};