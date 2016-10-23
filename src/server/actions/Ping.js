const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class Ping extends Action {

  constructor() {
    super(OPCode.PING, ...arguments);
  }

  build() {
    if (this.actionSchema) {
      return this.actionSchema.encode({
        timestamp: '' + Date.now()
      });
    }

    return null;
  }

}

module.exports = Ping;