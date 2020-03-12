export default class Color {
  r: number = 0;
  g: number = 0;
  b: number = 0;

  constructor(color: { r: number, g: number, b: number }) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }
}
