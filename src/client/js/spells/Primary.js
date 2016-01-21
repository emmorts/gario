export default class Primary {
  constructor(spellModel) {
    this.id = spellModel.id;
    this.ownerId = spellModel.ownerId;
    this.type = spellModel.type;
    this.mass = spellModel.mass;
    this.power = spellModel.power;
    this.velocity = { x: 0, y: 0 };
    this.speed = 5;
    this.radius = 10;
    
    this.color = spellModel.color || { r: 0, g: 0, b: 0 };
    this.position = spellModel.position || { x: 0, y: 0 };
    
    this.setTarget(spellModel.target);
  }
  
  calculateNextPosition() {
    if (typeof this.velocity.x !== 'undefined' && typeof this.velocity.y !== 'undefined') {
      this._calculatePosition.call(this);
    }
  }
  
  onAdd(owner) {
    owner.onCast(this);
  }
  
  onCollision(model) {
    model.health -= this.power;
    
    model.velocity.x += this.power * this.mass * this.velocity.x / model.mass;
    model.velocity.y += this.power * this.mass * this.velocity.y / model.mass;
    
    model.stunned = 50;
  }
  
  setTarget(target) {
    this.target = {
      x: target.x,
      y: target.y
    };
    
    var vX = this.target.x - this.position.x;
    var vY = this.target.y - this.position.y;
    var distance = this._getHypotenuseLength(vX, vY);
    
    this.velocity = {
      x: vX / distance,
      y: vY / distance
    };
  }
  
  _calculatePosition() {
    this.position = {
      x: this.position.x + this.velocity.x * this.speed,
      y: this.position.y + this.velocity.y * this.speed
    };
  }
  
  _getHypotenuseLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
}