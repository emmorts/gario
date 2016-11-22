const Logger = require('client/Logger');

class IRenderer {
  static draw() {
     Loggger.getInstance().error(`Method draw() was not initialized in ${this.constructor.name}`);
  }
}

module.exports = IRenderer;
