const PlayerBase = require('common/models/PlayerBase');
const PlayerRenderer = require('client/renderers/PlayerRenderer');

export default class Player extends PlayerBase {
  constructor(playerModel) {
    super();

    this.renderer = PlayerRenderer;

    this._initialize(playerModel);
  }

  update(deltaT) {
    super.update(deltaT);

    if (this._animateCast) {
      this._updateAnimation();
    }    
  }
  
  onCast(spell) {
    this._animateCast = true;
    this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
  }

  _initialize(playerModel) {
    if (playerModel) {
      this._animateCast = false;

      this.id = playerModel.id;
      this.ownerId = playerModel.ownerId;
      this.name = playerModel.name;
      this.health = playerModel.health;
      this.maxHealth = playerModel.maxHealth;
      
      this.color = {
        r: playerModel.color.r,
        g: playerModel.color.g,
        b: playerModel.color.b
      };
      
      this.position = {
        x: playerModel.position.x,
        y: playerModel.position.y
      };
      
      this.target = {
        x: (playerModel.target ? playerModel.target.x : playerModel.position.x),
        y: (playerModel.target ? playerModel.target.y : playerModel.position.y)
      };
    } else {
      console.error('Unable to construct player object - no model given.');
    }
  }
  
  _updateAnimation() {
    if (this._castTicks > 0) {
      const sign = Math.sign(this._castTicks - this._baseCastTicks / 2);
      this.radius += sign * (this._maxRadius - this.radius) / 4;
      this._castTicks--;
    } else {
      this.radius = this._baseRadius;
      this._castTicks = this._baseCastTicks;
      this._animateCast = false;

      this.targetRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
    }
  }
}