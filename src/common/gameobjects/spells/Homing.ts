import Point from "common/structures/Point";
import Spell from "common/gameobjects/spells/Spell";
import Player from "../models/Player";
import Velocity from "common/structures/Velocity";
import Color from 'common/structures/Color';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import { SpellTargetType } from 'common/gameobjects/spells/SpellTargetType';
import * as MathUtils from 'common/utils/MathUtils';

export default class Homing extends Spell {
  type = SpellType.Homing;
  targetType: SpellTargetType = SpellTargetType.Player;

  _speed = 2;
  _mass = 10;
  _power = 50;
  _duration = 5000;
  _cooldown = 1000;
  _radius = 15;
  _color: Color = { r: 80, g: 120, b: 150 };

  #followee: Player = null;
  #velocity: Velocity = { x: 0, y: 0 };
  #target: Point = Point.ZERO;
  #stunDuration = 50;

  update(deltaT: number) {
    if (this.#followee) {
      this.setTarget(this.#followee.position);
    }

    if (typeof this.#velocity.x !== 'undefined' && typeof this.#velocity.y !== 'undefined') {
      this.calculatePosition(deltaT);
    }
  }

  setTarget(target: Point) {
    this.#target = new Point({
      x: target.x,
      y: target.y,
    });

    const vX = this.#target.x - this._position.x;
    const vY = this.#target.y - this._position.y;
    const distance = MathUtils.getHypotenuseLength(vX, vY);

    this.#velocity = {
      x: vX / distance,
      y: vY / distance,
    };
  }

  onCollision(model: Player) {
    model.health -= this.power;

    model.addVelocity({
      x: (this.power * this.mass) * (this.#velocity.x / model.mass),
      y: (this.power * this.mass) * (this.#velocity.y / model.mass)
    });

    model.setStunned(this.#stunDuration);
  }

  calculatePosition(deltaT: number) {
    this._position.x += this.#velocity.x * this.speed;
    this._position.y += this.#velocity.y * this.speed;
  }
}
