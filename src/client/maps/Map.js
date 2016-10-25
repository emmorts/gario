const MapRenderer = require('client/renderers/MapRenderer');

class Map {
  constructor() {
    this.renderer = MapRenderer;

    this.width = 500;
    this.height = 500;
  }

}

module.exports = Map;