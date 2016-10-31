const models = require('server/models');

class ModelFactory {

  static instantiate(type) {
    if (models) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Model = models[type];

      if (Model) {
        return new Model(...args);
      }
    }

    return null;
  }

}

module.exports = ModelFactory;
