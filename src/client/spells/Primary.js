const SpellBase = require('common/models/SpellBase');

class Primary extends SpellBase {
  constructor(spellModel) {
    super();

    this.id = spellModel.id;
    this.ownerId = spellModel.ownerId;
    this.type = spellModel.type;
    this.mass = spellModel.mass;
    this.power = spellModel.power;
    
    this.color = spellModel.color || { r: 0, g: 0, b: 0 };
    this.position = spellModel.position || { x: 0, y: 0 };
    
    this.setTarget(spellModel.target);
  }
  
  onAdd(owner) {
    owner.onCast(this);
  }
}

module.exports = Primary;