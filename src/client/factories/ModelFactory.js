const models = require('client/models');
const Logger = require('client/Logger');
const OPCode = require('common/opCode');

class ModelFactory {

  static instantiate(type) {
    if (models) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Model = models[type];

      if (!Model) {
        Logger.error(`Model for '${OPCode.getName(type)}' was not found.`);
      }

      return new Model(...args);
    }

    return null;
  }

}

module.exports = ModelFactory;
