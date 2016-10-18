class SpellBase {
  constructor() {
    this.velocity = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.speed = 5;
    this.radius = 10;
  }

  update(deltaT) {
    if (typeof this.velocity.x !== 'undefined' && typeof this.velocity.y !== 'undefined') {
      this._calculatePosition(deltaT);
    }
  }
  
  setTarget(target) {
    this.target = {
      x: target.x,
      y: target.y
    };
    
    const vX = this.target.x - this.position.x;
    const vY = this.target.y - this.position.y;
    const distance = this._getHypotenuseLength(vX, vY);
    
    this.velocity = {
      x: vX / distance,
      y: vY / distance
    };
  }
  
  onCollision(model) {
    model.health -= this.power;
    
    model.velocity.x += this.power * this.mass * this.velocity.x / model.mass;
    model.velocity.y += this.power * this.mass * this.velocity.y / model.mass;
    
    model.stunned = 50;
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

module.exports = SpellBase;