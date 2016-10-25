class IRenderer {
  static draw(model, canvasContext) {
    console.error(`Method draw() was not initialized in ${this.constructor.name}`);
  }
}

module.exports = IRenderer;