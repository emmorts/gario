import Spell from 'common/gameobjects/spells/Spell';
import Velocity from 'common/structures/Velocity';
import Point from 'common/structures/Point';
import Player from 'common/gameobjects/models/Player';
import Color from 'common/structures/Color';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import { SpellTargetType } from 'common/gameobjects/spells/SpellTargetType';
import * as MathUtils from 'common/utils/MathUtils';

export default class Primary extends Spell {
  type = SpellType.Primary;
  targetType: SpellTargetType = SpellTargetType.Point;

  _speed = 2;
  _mass = 10;
  _power: 30;
  _duration = 5000;
  _cooldown = 1000;
  _radius = 10;
  _color: Color = { r: 200, g: 150, b: 40 };

  #velocity: Velocity = Velocity.ZERO;
  #position: Point = Point.ZERO;
  #target: Point = Point.ZERO;
  #stunDuration = 50;

  update(deltaT: number) {
    if (typeof this.#velocity.x !== 'undefined' && typeof this.#velocity.y !== 'undefined') {
      this.calculatePosition(deltaT);
    }
  }

  setTarget(target: Point) {
    this.#target = new Point(target);

    const vX = this.#target.x - this.#position.x;
    const vY = this.#target.y - this.#position.y;
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

  private calculatePosition(deltaT: number) {
    this.#position = new Point({
      x: this.#position.x + (this.#velocity.x * this.speed),
      y: this.#position.y + (this.#velocity.y * this.speed),
    });
  }
}
