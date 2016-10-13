const Schema = require('shared/schemas');

class Action {

  constructor(opCode) {
    this.actionSchema = Schema.get(opCode);
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