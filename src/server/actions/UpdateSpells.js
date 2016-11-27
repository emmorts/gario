const Action = require('server/actions/Action');
const OPCode = require('common/opCode');
const Logger = require('server/Logger');

class UpdateSpells extends Action {

  constructor() {
    super(OPCode.UPDATE_SPELLS, ...arguments);
  }

  build(object) {
    if ('updatedSpells' in object && 'destroyedSpells' in object) {
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
            followeeId: spell.followee ? spell.followee.id : '',
            r: spell.color.r,
            g: spell.color.g,
            b: spell.color.b,
          })),
          destroyedSpells: object.destroyedSpells.map(spell => ({
            id: spell.id,
          })),
        };

        return this.actionSchema.encode(flattenedObject);
      }
    } else {
      Logger.error(`Malformed object supplied in ${this.constructor.name}.build()`);
    }

    return null;
  }

}

module.exports = UpdateSpells;
