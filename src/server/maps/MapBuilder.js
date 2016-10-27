const IArena = require('common/gameobjects/maps/Arena');
const MapMaker = require('common/mapmaker');
const Arena = require('server/maps/ArenaMap');

class MapBuilder {
  constructor() {
    this.width = null;
    this.height = null;
    this.tileSize = null;
    this.mapName = null;
    this.map = null;
  }

  setWidth(width) {
    this.width = width;
  }

  setHight(height) {
    this.height = height;
  }

  setCube(length) {
    this.width = length;
    this.height = length;
  }

  setTileSize(tileSize) {
    this.tileSize = tileSize;
  }

  setMapName(name) {
    this.mapName = name;
  }

  constructMap() {
    if(this.width == null || this.height == null || this.tileSize == null || this.mapName == null) {
      throw "Incomplete build parameters";
    } else return new Arena({
      widht: this.width,
      height: this.height,
      tileSize: this.tileSize,
      map: MapMaker.get(this.mapName)(this.width,this.height)
    });
  }

}

module.exports = MapBuilder;