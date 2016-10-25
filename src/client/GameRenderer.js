const Camera = require('client/Camera');

class GameRenderer {
  constructor(canvasContext) {
    this.context = canvasContext;
    this.camera = new Camera(this);

    this.width = this.context.canvas.clientWidth;
    this.height = this.context.canvas.clientHeight;

    this._gameObjects = [];
  }

  draw(deltaT) {
    this.context.clearRect(0, 0, this.width, this.height);

    this._gameObjects.forEach(gameObject => {
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