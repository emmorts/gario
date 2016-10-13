export default {
  mapping: {
    updatedSpells: [{
      id: { type: 'string', length: 32 },
      ownerId: { type: 'string', length: 32 },
      type: 'uint8',
      mass: 'uint8',
      power: 'uint8',
      x: 'float32le',
      y: 'float32le',
      targetX: 'float32le',
      targetY: 'float32le',
      r: 'uint8',
      g: 'uint8',
      b: 'uint8'
    }],
    destroyedSpells: [{
      id: { type: 'string', length: 32 }
    }]
  },
  transform: (object) => {
    const updatedSpells = object.updatedSpells.map(spell => {
      return {
        id: spell.id,
        ownerId: spell.ownerId,
        type: spell.type,
        mass: spell.mass,
        power: spell.power,
        position: { x: spell.x, y: spell.y },
        target: { x: spell.targetX, y: spell.targetY },
        color: { r: spell.r, g: spell.g, b: spell.b }
      };
    });
    const destroyedSpells = object.destroyedSpells.map(spell => spell.id);
    
    return {
      updatedSpells,
      destroyedSpells
    };
  }
}