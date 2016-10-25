const Schema = require('common/Schema');
const OPCode = require('common/opCode');

module.exports = new Schema(OPCode.INITIALIZE_MAP, {
  width: 'uint8',
  height: 'uint8',
  tileSize: 'uint8',
  mapRows: [{
    mapColumns: [{
      value: 'uint8'
    }]
  }]
}, (arena) => {
  const tiledMap = arena.mapRows.map(row => {
    rows.mapColumns.map(collumn => collumn.value);
  });

  return {
    width: arena.width,
    height: arena.height,
    tileSize: arena.tileSize,
    tiledMap
  };
});
