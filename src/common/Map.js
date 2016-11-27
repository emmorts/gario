const Logger = require('common/loggers').default;

class Map {
  constructor() {
    this.width = null;
    this.height = null;
    this.tileSize = null;

    this.tiledMap = null;
  }

  withinBounds(x, y) {
    const insideHorizontally = x >= 0 && x <= this.width * this.tileSize;
    const insideVerically = y >= 0 && y <= this.height * this.tileSize;

    return insideHorizontally && insideVerically;
  }

  applyEffects() {
    Logger.error(`applyEffects() must be overriden in ${this.constructor.name}.`);
  }
}

module.exports = Map;
