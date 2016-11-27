const uuid = require('node-uuid');
const OPCode = require('common/opCode');
const Homing = require('common/gameobjects/spells/Homing');

class HomingSpell extends Homing {
  constructor(gameServer, owner, options) {
    super();

    if (options) {
      if (options.position) {
        this.position = options.position;
      }

      if (options.target) {
        this.setTarget(options.target);
      }
    }

    this.id = uuid.v4().replace(/-/g, '');
    this.type = OPCode.SPELL_HOMING;
    this.owner = owner;
    this.ownerId = owner.pId;
    this.gameServer = gameServer;
    this.color = { r: 80, g: 120, b: 150 };
    this.followee = this._findNearestTarget();
  }

  _findNearestTarget() {
    let currentMin = Number.MAX_SAFE_INTEGER;
    let potentialFollowee = null;

    this.gameServer.players.forEach((playerController) => {
      if (playerController.pId !== this.ownerId) {
        const distance = this._getDistance(playerController.model);

        if (distance < currentMin) {
          currentMin = distance;
          potentialFollowee = playerController.model;
        }
      }
    }, this);

    return potentialFollowee;
  }

  _getDistance(player) {
    if (player) {
      const vecX = Math.pow(this.position.x - player.position.x, 2);
      const vecY = Math.pow(this.position.y - player.position.y, 2);

      return vecX + vecY;
    }

    return null;
  }
}

module.exports = HomingSpell;
