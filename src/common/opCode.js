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

  // models
  'MODEL_PLAYER',

  // maps
  'MAP_ARENA',

  // direction
  'DIRECTION_WEST',
  'DIRECTION_EAST',
  'DIRECTION_NORTH',
  'DIRECTION_SOUTH',
  'DIRECTION_NWEST',
  'DIRECTION_NEAST',
  'DIRECTION_SWEST',
  'DIRECTION_SEAST',

  // types
  'TYPE_SPELL',
  'TYPE_MODEL',
  'TYPE_GAMEMODE',
  'TYPE_MAP',
]);
