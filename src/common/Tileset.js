const listOfTilesets = [
  "LAVA",
  "FLAT"
];

const tilesets = {};

listOfTilesets.forEach((tileset, index) => tilesets[tileset] = ++index);

module.exports = tilesets;

module.exports.getName = (tileset) => {
  for (let propertyName in tilesets) {
    if (tilesets[propertyName] === tileset) {
      return propertyName;
    }
  }

  return null;
};