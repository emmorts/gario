const Schema = require('common/Schema');
const OPCode = require('common/opCode');
const Point = require('common/structures/Point');

module.exports = new Schema(OPCode.UPDATE_PLAYERS, {
  updatedPlayers: [{
    id: 'string',
    ownerId: 'string',
    name: 'string',
    health: 'uint16le',
    maxHealth: 'uint16le',
    x: 'int16le',
    y: 'int16le',
    targetX: 'int16le',
    targetY: 'int16le',
    r: 'uint8',
    g: 'uint8',
    b: 'uint8',
  }],
  destroyedPlayers: [{
    id: { type: 'string', length: 32 },
  }],
}, (object) => {
  const updatedPlayers = object.updatedPlayers.map(player => ({
    id: player.id,
    ownerId: player.ownerId,
    name: player.name,
    health: player.health,
    maxHealth: player.maxHealth,
    position: new Point(player),
    target: new Point(player.targetX, player.targetY),
    color: { r: player.r, g: player.g, b: player.b },
  }));
  const destroyedPlayers = object.destroyedPlayers.map(player => player.id);

  return {
    updatedPlayers,
    destroyedPlayers,
  };
});
