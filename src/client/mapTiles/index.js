const Tileset = require('common/Tileset');

module.exports = {
  [Tileset.FLAT]: require('client/mapTiles/Flat'),
  [Tileset.LAVA]: require('client/mapTiles/Lava'),
};
