const Schema = require('common/schemas');

class Action {

  constructor(opCode) {
    this.actionSchema = Schema.get(opCode);
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

};

module.exports = Action;