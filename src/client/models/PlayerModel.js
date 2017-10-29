const InputHandler = require('client/InputHandler');
const Player = require('common/gameobjects/models/Player');
const PlayerRenderer = require('client/renderers/PlayerRenderer');
const OPCode = require('common/opCode');
const Logger = require('client/Logger');
const Point = require('common/structures/Point');

class PlayerModel extends Player {
  constructor(playerModel) {
    super();

    this.renderer = PlayerRenderer;
    this.packetQueue = [];

    this._initialize(playerModel);
  }

  handleInput() {
    InputHandler.on(InputHandler.key.MOUSE2, (mousePosition) => {
      if (this.health > 0) {
        this.setTarget(new Point(mousePosition));

        this.packetQueue.push({
          code: OPCode.PLAYER_MOVE,
          options: this,
        });
      }
    });

    InputHandler.on(InputHandler.key.SPACE, (mousePosition) => {
      if (this.health > 0) {
        this.packetQueue.push({
          code: OPCode.CAST_SPELL,
          options: {
            type: OPCode.SPELL_PRIMARY,
            playerX: this.position.x,
            playerY: this.position.y,
            x: mousePosition.x,
            y: mousePosition.y,
          },
        });
      }
    });

    InputHandler.on(InputHandler.key.D, (mousePosition) => {
      if (this.health > 0) {
        this.packetQueue.push({
          code: OPCode.CAST_SPELL,
          options: {
            type: OPCode.SPELL_HOMING,
            playerX: this.position.x,
            playerY: this.position.y,
            x: mousePosition.x,
            y: mousePosition.y,
          },
        });
      }
    });
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

      this.position = new Point(playerModel.position);

      this.target = new Point({
        x: (playerModel.target ? playerModel.target.x : playerModel.position.x),
        y: (playerModel.target ? playerModel.target.y : playerModel.position.y),
      });
    } else {
      Logger.error('Unable to construct player object - no model given.');
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
