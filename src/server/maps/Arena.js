const IArena = require('common/gameobjects/maps/IArena');
const MapMaker = require('common/mapmaker');
const MapNames = require('common/MapName');

class Arena extends IArena {
  constructor(params) {
    super();

    this.tileSize = params.tileSize;
    this.width = params.width;
    this.height = params.height;
  
    this.map = params.map;

  }
}

module.exports = Arena;