const Arena = require('common/gameobjects/maps/Arena');
const MapMaker = require('common/mapmaker');
const MapNames = require('common/MapName');

class ArenaMap extends Arena {
  constructor(params) {
    super();

    this.tileSize = params.tileSize;
    this.cubicWidth = params.width;
    this.cubicHeight = params.height;
  
    this.tiledMap = params.map;

  }
}

module.exports = ArenaMap;