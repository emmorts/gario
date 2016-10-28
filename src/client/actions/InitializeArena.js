const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class InitializeArena extends Action {

  constructor() {
    super(OPCode.INITIALIZE_ARENA);
  }

  static get eventName() {
    return 'initializeArena';
  }

}

module.exports = InitializeArena;