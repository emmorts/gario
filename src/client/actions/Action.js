const Schema = require('schemas');

class Action {

  constructor(opCode) {
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