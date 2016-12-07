const maps = require('client/maps');
const Logger = require('client/Logger');
const OPCode = require('common/opCode');

class MapFactory {

  static instantiate(type) {
    if (maps) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Map = maps[type];

      if (!Map) {
        Logger.error(`Map for '${OPCode.getName(type)}' was not found.`);
      } else {
        return new Map(...args);
      }
    }

    return null;
  }

}

module.exports = MapFactory;
