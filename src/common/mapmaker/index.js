const MapNames = require('common/MapName');

const maps = {
  [MapNames.COMPLETE]: require('common/mapmaker/Complete'),
  [MapNames.HOLY]: require('common/mapmaker/Holy'),
};

module.exports.get = mapName => {
  if (mapName in maps) {
    return maps[mapName];
  } else {
    console.error(`Unable to find map for ${MapNames.getName(mapName)}.`);
  }
};