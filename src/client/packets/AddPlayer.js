export default {
  mapping: {
    id: { type: 'string', length: 32 },
    ownerId: { type: 'string', length: 32},
    name: 'string',
    health: 'uint16le',
    maxHealth: 'uint16le',
    x: 'float32le',
    y: 'float32le',
    r: 'uint8',
    g: 'uint8',
    b: 'uint8'
  },
  transform: (player) => {
    return {
      id: player.id,
      ownerId: player.ownerId,
      name: player.name,
      health: player.health,
      maxHealth: player.maxHealth,
      position: { x: player.x, y: player.y },
      color: { r: player.r, g: player.g, b: player.b }
    };
  }
};