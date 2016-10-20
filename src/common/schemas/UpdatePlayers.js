const Schema = require('../Schema');
const OPCode = require('../opCode');

module.exports = new Schema(OPCode.UPDATE_PLAYERS, {
  updatedPlayers: [{
    id: 'string',
    ownerId: 'string',
    name: 'string',
    health: 'uint16le',
    maxHealth: 'uint16le',
    x: 'float32le',
    y: 'float32le',
    targetX: 'float32le',
    targetY: 'float32le',
    r: 'uint8',
    g: 'uint8',
    b: 'uint8'
  }],
  destroyedPlayers: [{
    id: { type: 'string', length: 32 }
  }]
}, (object) => {
  const updatedPlayers = object.updatedPlayers.map(player => {
    return {
      id: player.id,
      ownerId: player.ownerId,
      name: player.name,
      health: player.health,
      maxHealth: player.maxHealth,
      position: { x: player.x, y: player.y },
      target: { x: player.targetX, y: player.targetY },
      color: { r: player.r, g: player.g, b: player.b }
    };
  });
  const destroyedPlayers = object.destroyedPlayers.map(player => player.id);
  
  return {
    updatedPlayers,
    destroyedPlayers
  };
});