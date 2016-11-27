const Enumeration = require('common/Enumeration');

module.exports = new Enumeration([
  'PING',
  'PONG',
  'SPAWN_PLAYER',
  'ADD_PLAYER',
  'UPDATE_PLAYERS',
  'UPDATE_SPELLS',
  'PLAYER_MOVE',
  'CAST_SPELL',
  'COLLISION',
  'INITIALIZE_MAP',

  // cast
  'CAST_PRIMARY',

  // spells
  'SPELL_PRIMARY',
  'SPELL_HOMING',

  // models
  'MODEL_PLAYER',

  // maps
  'MAP_ARENA',

  // types
  'TYPE_SPELL',
  'TYPE_MODEL',
  'TYPE_GAMEMODE',
  'TYPE_MAP',
]);
