const OPCode = require('common/opCode');

module.exports = {
  [OPCode.ADD_PLAYER]: require('client/actions/AddPlayer'),
  [OPCode.CAST_SPELL]: require('client/actions/CastSpell'),
  [OPCode.COLLISION]: require('client/actions/Collision'),
  [OPCode.INITIALIZE_ARENA]: require('client/actions/InitializeArena'),
  [OPCode.PING]: require('client/actions/Ping'),
  [OPCode.PONG]: require('client/actions/Pong'),
  [OPCode.PLAYER_MOVE]: require('client/actions/PlayerMove'),
  [OPCode.SPAWN_PLAYER]: require('client/actions/SpawnPlayer'),
  [OPCode.UPDATE_PLAYERS]: require('client/actions/UpdatePlayers'),
  [OPCode.UPDATE_SPELLS]: require('client/actions/UpdateSpells'),
};