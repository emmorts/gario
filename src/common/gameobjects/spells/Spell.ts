import GameObject from 'common/GameObject';
import Player from 'common/gameobjects/models/Player';
import Color from 'common/structures/Color';
import Point from 'common/structures/Point';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import { SpellTargetType } from 'common/gameobjects/spells/SpellTargetType';

export default abstract class Spell extends GameObject {
  type: SpellType = SpellType.Undefined;
  targetType: SpellTargetType = SpellTargetType.Undefined;
  ownerId: string;

  protected abstract _speed = -1;
  protected abstract _mass = -1;
  protected abstract _power = -1;
  protected abstract _duration = -1;
  protected abstract _cooldown = -1;
  protected abstract _radius = -1;
  protected abstract _color: Color;
  protected readonly _position: Point = Point.ZERO;

  constructor(ownerId: string) {
    super();
    
    this.ownerId = ownerId;
  }

  get speed() {
    return this._speed;
  }

  get mass() {
    return this._mass;
  }

  get power() {
    return this._power;
  }

  get duration() {
    return this._duration;
  }

  get cooldown() {
    return this._cooldown;
  }

  get radius() {
    return this._radius;
  }

  get color() {
    return this._color;
  }

  get position() {
    return this._position;
  }

  applyDamage(damage: number): void {}

  abstract onCollision(gameObject: GameObject): void;
  abstract update(deltaT: number): void;
  abstract setTarget(target: Player | Point): void;
}
