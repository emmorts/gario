class PlayerBehaviour {

  _calculatePosition(deltaT) {
    if (!this._arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
      if (this._friction < 1) {
        this._friction += this.acceleration;
      }
      
      const speed = this.speed * this._friction;
      let velX = this.velocity.x;
      let velY = this.velocity.y;
      let velocity = 0, fn;
      
      if (!this.stunned) {
        const vX = this.target.x - this.position.x;
        const vY = this.target.y - this.position.y;
        const distance = this._getHypotenuseLength(vX, vY);
        
        velX = (vX / distance) * speed;
        velY = (vY / distance) * speed;
      }
      
      if (Math.abs(this.velocity.x - velX) > this.acceleration) {
        velocity = this.acceleration * Math.sign(velX);
        fn = Math.sign(velX) !== 1 ? Math.max : Math.min;
        this.velocity.x = fn(this.velocity.x + velocity, Math.sign(velX) * speed); 
      } else {
        this.velocity.x = velX;
      }
      
      if (Math.abs(this.velocity.y - velY) > this.acceleration) {
        velocity = this.acceleration * Math.sign(velY);
        fn = Math.sign(velY) !== 1 ? Math.max : Math.min;
        this.velocity.y = fn(this.velocity.y + velocity, Math.sign(velY) * speed); 
      } else {
        this.velocity.y = velY;
      }
      
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      
      if (this.stunned) {
        this.velocity.x *= (1 - this.acceleration);
        this.velocity.y *= (1 - this.acceleration);
        this.target.x = this.position.x;
        this.target.y = this.position.y;
        this.stunned--;
      }
    } else {
      this._friction = this._baseFriction;
      this.velocity = { x: 0, y: 0 };
    }
  }
  
  _calculateRotation(deltaT) {
    if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
      if (this._rotationTicks > 0) {
        if (this.rotation > Math.PI) {
          this.rotation = -Math.PI - (Math.PI - Math.abs(this.rotation));
        } else if (this.rotation < -Math.PI) {
          this.rotation = Math.PI + (Math.PI - Math.abs(this.rotation));
        }
        if (Math.abs(this.targetRotation - this.rotation) > Math.PI) {
          const diffA = Math.PI - Math.abs(this.rotation);
          const diffB = Math.PI - Math.abs(this.targetRotation);
          const diff = diffA + diffB;
          if (this.rotation > 0) {
            this.rotation += diff / this._rotationTicks;
          } else {
            this.rotation -= diff / this._rotationTicks;
          }
        } else {
          this.rotation += (this.targetRotation - this.rotation) / this._rotationTicks;
        }
      } else {
        this.rotation = this.targetRotation;
        this._rotationTicks = this._baseRotationTicks;
      }
    }
  }
  
  _getHypotenuseLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
  
  _arePositionsApproximatelyEqual(positionA, positionB) {
    const errorMargin = 5;
    
    const isHorizontalPositionEqual = Math.abs(positionA.x - positionB.x) < errorMargin;
    const isVerticalPositionEqual = Math.abs(positionA.y - positionB.y) < errorMargin;

    return isHorizontalPositionEqual && isVerticalPositionEqual;
  }
}

module.exports = PlayerBehaviour;