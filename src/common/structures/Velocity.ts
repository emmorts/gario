export default class Velocity {
  x: number = 0;
  y: number = 0;

  constructor(velocity: { x: number, y: number }) {
    this.x = velocity.x;
    this.y = velocity.y;
  }

  static get ZERO() {
    return new Velocity({ x: 0, y: 0 });
  }
}