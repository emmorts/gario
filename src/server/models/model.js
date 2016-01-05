function Model() {
  this.id = -1;
  this.owner = null;
}

module.exports = Model;

Model.prototype.setColor = function () {
  // override
}

Model.prototype.calculateMovement = function () {
  // override
}

Model.prototype.onAdd = function () {
  // override
}