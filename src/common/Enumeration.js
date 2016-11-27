const Logger = require('common/loggers').default;

class Enumeration {
  constructor(object, powerOfTwo) {
    if (!object) {
      throw new Error('Unable to construct an enum, no object provided.');
    }

    if (object instanceof Array) {
      object.forEach((name, index) => {
        this[name] = powerOfTwo ? Math.pow(2, index) : index + 1;
      });
    } else if (object instanceof Object) {
      Object.keys(object).forEach((key) => {
        this[key] = object[key];
      });
    }
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
