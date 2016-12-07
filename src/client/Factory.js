const factories = require('client/factories');
const Logger = require('client/Logger');
const OPCode = require('common/opCode');

class Factory {

  static instantiate(classType) {
    if (factories) {
      const args = Array.prototype.slice.call(arguments, 1);
      const factory = factories[classType];

      if (!factory) {
        Logger.error(`Factory for '${OPCode.getName(classType)}' was not found.`);
      } else {
        return factory.instantiate.apply(this, args);
      }
    }

    return null;
  }

}

module.exports = Factory;
