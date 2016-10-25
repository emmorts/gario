const models = require('client/models');

class ModelFactory {

  static instantiate(type) {
    if (models) {
      const args = Array.prototype.slice.call(arguments, 1);
      const model = models[type];

      if (model) {
        return new model(...args);
      }
    }

    return null;
  }

}

module.exports = ModelFactory;