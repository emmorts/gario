const Schema = require('common/schemas');

class Action {

  constructor(opCode, gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
    this.actionSchema = Schema.get(opCode);
  }

  execute() {
    throw new Error(`execute() must be overriden in an action ${this.constructor.name}`);
  }

  parse(buffer) {
    if (this.actionSchema) {
      return this.actionSchema.decode(buffer);
    }

    return null;
  }

  build(object) {
    if (this.actionSchema) {
      return this.actionSchema.encode(object);
    }

    return null;
  }

};

module.exports = Action;