export default class Point {
  x: number = 0;
  y: number = 0;

  constructor(position: { x: number, y: number }) {
    this.x = position.x;
    this.y = position.y;
  }

  distanceTo(point: Point) {
    if (point) {
      const diffX = point.x - this.x;
      const diffY = point.y - this.y;

      return Math.abs(diffX) + Math.abs(diffY);
    }

    return -1;
  }

  static get ZERO() {
    return new Point({ x: 0, y: 0 });
  }
}
