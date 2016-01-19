function Primary(spellModel) {
  this.id = spellModel.id;
  this.ownerId = spellModel.ownerId;
  this.type = spellModel.type;
  this.mass = spellModel.mass;
  this.power = spellModel.power;
  this.velocity = { x: 0, y: 0 };
  this.speed = 7;
  this.radius = 10;
  
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
  if (typeof this.velocity.x !== 'undefined' && typeof this.velocity.y !== 'undefined') {
    calculatePosition.call(this);
  }
}

Primary.prototype.onCollision = function (model) {
  model.health -= 10;
  
  model.velocity.x += this.power * this.mass * this.velocity.x / model.mass;
  model.velocity.y += this.power * this.mass * this.velocity.y / model.mass;
}

module.exports = Primary;

function calculatePosition() {
  this.position = {
    x: this.position.x + this.velocity.x * this.speed,
    y: this.position.y + this.velocity.y * this.speed
  };
}

function getHypotenuseLength(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function setTarget(x, y) {
  this.target = { x, y };
  
  var vX = this.target.x - this.position.x;
  var vY = this.target.y - this.position.y;
  var distance = getHypotenuseLength(vX, vY);
  
  this.velocity = {
    x: vX / distance,
    y: vY / distance
  };
}