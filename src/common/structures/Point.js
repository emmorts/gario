class Point {
  constructor(x = 0, y = 0) {
    if (typeof x === 'object'
      && x.x !== null && x.x !== undefined
      && x.y !== null && x.y !== undefined) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  distanceTo(point) {
    if (point && point instanceof Point) {
      const diffX = point.x - this.x;
      const diffY = point.y - this.y;

      return Math.abs(diffX) + Math.abs(diffY);
    }

    return -1;
  }
}

module.exports = Point;
