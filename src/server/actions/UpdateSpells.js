const Action = require('actions/Action');
const OPCode = require('../../opCode');

let instance = null;

class UpdateSpells extends Action {

  constructor() {
    if (instance) return instance;

    super(OPCode.UPDATE_SPELLS, ...arguments);

    instance = this;
  }

  build(object) {
    if (this.actionSchema) {
      const flattenedObject = {
        updatedSpells: object.updatedSpells.map(spell => ({
          id: spell.id,
          ownerId: spell.owner.pId,
          type: spell.type,
          mass: spell.mass,
          power: spell.power,
          x: spell.position.x,
          y: spell.position.y,
          targetX: spell.target.x,
          targetY: spell.target.y,
          r: spell.color.r,
          g: spell.color.g,
          b: spell.color.b,
        })),
        destroyedSpells: object.destroyedSpells.map(spell => ({
          id: spell.id
        }))
      };
      
      return this.actionSchema.encode(flattenedObject);
    }

    return null;
  }
  
}

module.exports = UpdateSpells;