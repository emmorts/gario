const Logger = require('client/Logger');

class MapRenderer {
  constructor(canvasContext, camera) {
    this.context = canvasContext;
    this.camera = camera;

    this._map = null;
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

  set map(map) {
    if (map && this._map !== map) {
      if ('renderer' in map && typeof map.renderer === 'function') {
        this._map = map;
      } else {
        Logger.warn(`Map ${map.constructor.name} does not have a renderer.`);
      }
    }
  }

  draw(deltaT) {
    if (this.context && this._map) {
      this.context.clearRect(
        0,
        0,
        this.width,
        this.height
      );

      this._map.renderer.draw(this._map, this, deltaT);
    }
  }
}

module.exports = MapRenderer;
