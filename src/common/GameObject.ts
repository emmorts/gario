import Point from 'common/structures/Point';

export default abstract class GameObject {
  id: string;

  protected _visible: boolean = true;
  protected abstract _position: Point;
  protected abstract _radius: number;

  get position() {
    return this._position;
  }

  get radius() {
    return this._radius;
  }

  abstract applyDamage(damage: number): void;
}
