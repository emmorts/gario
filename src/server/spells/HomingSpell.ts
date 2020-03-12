import { v4 as uuid } from 'uuid';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import Point from 'common/structures/Point';
import Homing from 'common/gameobjects/spells/Homing';

interface HomingSpellConstructorOptions {
  position: Point,
  target: Point
}

export default class HomingSpell extends Homing {
  id = uuid().replace(/-/g, '');
  type = SpellType.Homing;

  constructor(ownerId: string, options: HomingSpellConstructorOptions) {
    super(ownerId);

    if (options.position) {
      this._position.x = options.position.x;
      this._position.y = options.position.y;
    }

    if (options.target) {
      this.setTarget(options.target);
    }

    // this.owner = owner;
    // this.ownerId = owner.pId;
    // this.gameServer = gameServer;
    // this.followee = this._findNearestTarget();
  }

  // _findNearestTarget() {
  //   let currentMin = Number.MAX_SAFE_INTEGER;
  //   let potentialFollowee = null;

  //   this.gameServer.players.forEach((playerController) => {
  //     if (playerController.pId !== this.ownerId) {
  //       const distance = this._getDistance(playerController.model);

  //       if (distance < currentMin) {
  //         currentMin = distance;
  //         potentialFollowee = playerController.model;
  //       }
  //     }
  //   }, this);

  //   return potentialFollowee;
  // }

  // // do manhattan better
  // _getDistance(player) {
  //   if (player) {
  //     const vecX = Math.pow(this.position.x - player.position.x, 2);
  //     const vecY = Math.pow(this.position.y - player.position.y, 2);

  //     return vecX + vecY;
  //   }

  //   return null;
  // }
}
