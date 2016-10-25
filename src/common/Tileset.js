const operations = [
  "LAVA",
  "FLAT"
];

const tilesets = {};

operations.forEach((op, index) => tilesets[op] = ++index);

module.exports = tilesets;

module.exports.getName = (tileset) => {
  for (let propertyName in tilesets) {
    if (tilesets[propertyName] === tileset) {
      return propertyName;
    }
  }

  return null;
};