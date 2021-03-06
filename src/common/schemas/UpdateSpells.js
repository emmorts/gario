const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.UPDATE_SPELLS, {
  updatedSpells: [{
    id: 'string',
    ownerId: 'string',
    type: 'uint8',
    mass: 'uint8',
    power: 'uint8',
    x: 'int16le',
    y: 'int16le',
    targetX: 'int16le',
    targetY: 'int16le',
    followeeId: 'string',
    r: 'uint8',
    g: 'uint8',
    b: 'uint8',
  }],
  destroyedSpells: [{
    id: { type: 'string', length: 32 },
  }],
}, (object) => {
  const updatedSpells = object.updatedSpells.map(spell => ({
    id: spell.id,
    ownerId: spell.ownerId,
    followeeId: spell.followeeId,
    type: spell.type,
    mass: spell.mass,
    power: spell.power,
    position: { x: spell.x, y: spell.y },
    target: { x: spell.targetX, y: spell.targetY },
    color: { r: spell.r, g: spell.g, b: spell.b },
  }));
  const destroyedSpells = object.destroyedSpells.map(spell => spell.id);

  return {
    updatedSpells,
    destroyedSpells,
  };
});
