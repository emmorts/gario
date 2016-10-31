const maps = require('client/maps');

class MapFactory {

  static instantiate(type) {
    if (maps) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Map = maps[type];

      if (Map) {
        return new Map(...args);
      }
    }

    return null;
  }

}

module.exports = MapFactory;
