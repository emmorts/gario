const Schema = require('common/schemas');

class Action {

  constructor(opCode, socket) {
    this.actionSchema = Schema.get(opCode);
    this.socket = socket;
  }

  execute(buffer) {
    return this.parse(buffer);
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

}

module.exports = Action;
