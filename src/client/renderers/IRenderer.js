class IRenderer {
  static draw() {
    console.error(`Method draw() was not initialized in ${this.constructor.name}`);
  }
}

module.exports = IRenderer;
