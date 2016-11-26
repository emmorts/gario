const Logger = require('client/Logger');

class GameRenderer {
  constructor(canvasContext, camera) {
    this.context = canvasContext;
    this.camera = camera;
    this.scrollDirection = null;

    this._gameObjects = [];
  }

  get width() {
    if (this.context) {
      return this.context.canvas.clientWidth;
    }

    return null;
  }

  get height() {
    if (this.context) {
      return this.context.canvas.clientHeight;
    }

    return null;
  }

  draw(deltaT) {
    if (this.context) {
      this.camera.update(this.scrollDirection, deltaT);

      this.context.clearRect(
        this.camera.scrollX,
        this.camera.scrollY,
        this.width,
        this.height
      );

      this._gameObjects.forEach((gameObject) => {
        gameObject.renderer.draw(gameObject, this, deltaT);
      });
    }
  }

  add(gameObject) {
    if (gameObject && this._gameObjects.indexOf(gameObject) === -1) {
      if (gameObject.renderer) {
        this._gameObjects.push(gameObject);
      } else {
        Logger.warn(`Game object ${gameObject.constructor.name} does not have a renderer.`);
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
