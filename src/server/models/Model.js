const OPCode = require('../../opCode');

function Model() {
  this.id = -1;
  this.owner = null;
  this.type = OPCode.TYPE_MODEL;
}

module.exports = Model;

Model.prototype.setColor = function () {
  // override
}

Model.prototype.onAdd = function () {
  // override
}