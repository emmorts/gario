const Camera = require('client/Camera');

class GameRenderer {
  constructor(canvasContext) {
    this.context = canvasContext;
    this.scrollDirection = null;
    this.camera = new Camera(this);

    this._gameObjects = [];
  }

  get width() {
    return this.context.canvas.clientWidth;
  }

  get height() {
    return this.context.canvas.clientHeight;
  }

  draw(deltaT) {
    this.camera.update(this.scrollDirection, deltaT);

    // TODO: Current solution is ineffective, should only clear the screen of what was drawn
    this.context.clearRect(0, 0, this.width, this.height);

    this._gameObjects.forEach((gameObject) => {
      gameObject.renderer.draw(gameObject, this, deltaT);
    });
  }

  add(gameObject) {
    if (gameObject && this._gameObjects.indexOf(gameObject) === -1) {
      if (gameObject.renderer) {
        this._gameObjects.push(gameObject);
      } else {
        console.warn(`Game object ${gameObject.constructor.name} does not have a renderer.`);
      }
    }
  }

  remove(gameObject) {
    if (gameObject) {
      const index = this._gameObjects.indexOf(gameObject);
      if (index !== -1) {
        this._gameObjects.splice(index, 1);
      }
    }
  }
}

module.exports = GameRenderer;
