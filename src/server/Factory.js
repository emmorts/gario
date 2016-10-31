const factories = require('server/factories');

class Factory {

  static instantiate(classType) {
    if (factories) {
      const args = Array.prototype.slice.call(arguments, 1);
      const factory = factories[classType];

      if (factory) {
        return factory.instantiate.apply(this, args);
      }
    }

    return null;
  }

}

module.exports = Factory;
