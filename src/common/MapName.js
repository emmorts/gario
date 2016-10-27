const listOfMaps = [
  "COMPLETE",
  "HOLY"
];

const maps = {};

listOfMaps.forEach((map, index) => maps[map] = ++index);

module.exports = maps;

module.exports.getName = (map) => {
  for (let propertyName in maps) {
    if (maps[propertyName] === map) {
      return propertyName;
    }
  }

  return null;
};