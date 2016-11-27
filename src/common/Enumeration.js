const Logger = require('common/loggers').default;

class Enumeration {
  constructor(array, powerOfTwo) {
    if (!array) {
      throw new Error('Unable to construct an enum, no array provided.');
    }

    array.forEach((name, index) => {
      this[name] = powerOfTwo ? Math.pow(2, index) : index + 1;
    });
  }

  get(name) {
    if (name in this) {
      return this[name];
    }

    Logger.log(`${name} was not found in enum.`);

    return null;
  }

  getName(value) {
    return Object.keys(this).find(propertyName => this[propertyName] === value);
  }
}

module.exports = Enumeration;
