const operations = [
  "PING",
  "PONG",
  "SPAWN_PLAYER",
  "ADD_PLAYER",
  "UPDATE_PLAYERS",
  "UPDATE_SPELLS",
  "PLAYER_MOVE",
  "CAST_SPELL",
  "COLLISION",
  
  // cast
  "CAST_PRIMARY",
  
  // spells
  "SPELL_PRIMARY",

  // models
  "MODEL_PLAYER",
  
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

module.exports.getName = (opCode) => {
  for (let propertyName in opCodes) {
    if (opCodes[propertyName] === opCode) {
      return propertyName;
    }
  }

  return null;
};