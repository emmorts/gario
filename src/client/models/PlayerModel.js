const Player = require('common/gameobjects/models/Player');
const PlayerRenderer = require('client/renderers/PlayerRenderer');

class PlayerModel extends Player {
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

    const diffX = spell.target.x - this.position.x;
    const diffY = spell.target.y - this.position.y;

    this.targetRotation = Math.atan2(diffY, diffX);
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
        b: playerModel.color.b,
      };

      this.position = {
        x: playerModel.position.x,
        y: playerModel.position.y,
      };

      this.target = {
        x: (playerModel.target ? playerModel.target.x : playerModel.position.x),
        y: (playerModel.target ? playerModel.target.y : playerModel.position.y),
      };
    } else {
      console.error('Unable to construct player object - no model given.');
    }
  }

  _updateAnimation() {
    if (this._castTicks > 0) {
      const sign = Math.sign(this._castTicks - (this._baseCastTicks / 2));
      const radius = sign * (this._maxRadius - this.radius);

      this.radius += radius / 4;
      this._castTicks -= 1;
    } else {
      this.radius = this._baseRadius;
      this._castTicks = this._baseCastTicks;
      this._animateCast = false;

      const diffX = this.target.x - this.position.x;
      const diffY = this.target.y - this.position.y;

      this.targetRotation = Math.atan2(diffY, diffX);
    }
  }
}

module.exports = PlayerModel;
