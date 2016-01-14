function Primary(spellModel) {
  this.id = spellModel.id;
  this.ownerId = spellModel.ownerId;
  this.type = spellModel.type;
  this.mass = spellModel.mass;
  this.power = spellModel.power;
  this.direction = { x: 0, y: 0 };
  this.speed = 10;
  
  this.position = {
    x: spellModel.x,
    y: spellModel.y
  };
  
  this.color = {
    r: spellModel.r,
    g: spellModel.g,
    b: spellModel.b,
  };
  
  setTarget.call(this, spellModel.targetX, spellModel.targetY);
}

Primary.prototype.calculateNextPosition = function () {
  if (typeof this.direction.x !== 'undefined' && typeof this.direction.y !== 'undefined') {
    calculatePosition.call(this);
  }
}

module.exports = Primary;

function calculatePosition() {
  this.position = {
    x: this.position.x + this.direction.x * this.speed,
    y: this.position.y + this.direction.y * this.speed
  };
  console.log(this.position.x, this.position.y);
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function setTarget(x, y) {
  this.target = { x, y };
  
  var vX = this.target.x - this.position.x;
  var vY = this.target.y - this.position.y;
  var distance = getHypotenuseLength(vX, vY);
  
  this.direction = {
    x: vX / distance,
    y: vY / distance
  };
}