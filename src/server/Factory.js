const factories = require('./factories');

class Factory {

  static instantiate(classType, type) {
    if (factories) {
      const args = Array.prototype.slice.call(arguments, 1);
      const factory = factories[classType];
      console.log(args);

      if (factory) {
        return factory.instantiate.apply(this, args);
      }
    }

    return null;
  }

}

module.exports = Factory;