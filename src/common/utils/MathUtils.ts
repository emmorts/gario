import Point from 'common/structures/Point';

export enum DistanceStrategy {
  Euclidean,
  Manhattan
}

export function getHypotenuseLength(x: number, y: number): number {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function getDistance(pointA: Point, pointB: Point, strategy: DistanceStrategy = DistanceStrategy.Manhattan) {
  const xDiff = pointA.x - pointB.x;
  const yDiff = pointA.y - pointB.y;

  switch (strategy) {
    case DistanceStrategy.Euclidean:
      return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    case DistanceStrategy.Manhattan:
      return Math.abs(xDiff) + Math.abs(yDiff);
  }
}

export function arePointsRoughlyEqual(pointA: Point, pointB: Point, errorMargin: number = 5) {
  const isHorizontalPositionEqual = Math.abs(pointA.x - pointB.x) < errorMargin;
  const isVerticalPositionEqual = Math.abs(pointA.y - pointB.y) < errorMargin;

  return isHorizontalPositionEqual && isVerticalPositionEqual;
}