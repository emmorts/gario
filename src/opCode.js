const operations = [
  "PING",
  "PONG",
  "SPAWN_PLAYER",
  "ADD_PLAYER",
  "UPDATE_PLAYERS",
  "UPDATE_SPELLS",
  "PLAYER_MOVE",
  
  // cast
  "CAST_PRIMARY",
  
  // spells
  "SPELL_PRIMARY",
  
  // direction
  "DIRECTION_WEST",
  "DIRECTION_EAST",
  "DIRECTION_NORTH",
  "DIRECTION_SOUTH",
  "DIRECTION_NWEST",
  "DIRECTION_NEAST",
  "DIRECTION_SWEST",
  "DIRECTION_SEAST",

  // types
  "TYPE_SPELL",
  "TYPE_MODEL",
  "TYPE_GAMEMODE",
  "TYPE_MAP"
];

const opCodes = {};

operations.forEach((op, index) => opCodes[op] = ++index);

module.exports = opCodes;