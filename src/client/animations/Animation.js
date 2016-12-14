class Animation {
  constructor(sprite, frameSpeed, startFrame, endFrame) {
    this._animationSequence = [];
    this._currentFrame = 0;
    this._counter = 0;
    this._frameSpeed = frameSpeed;
    this._sprite = sprite;

    for (let i = startFrame; i <= endFrame; i++) {
      this._animationSequence.push(i);
    }
  }

  update() {
    if (this._counter === (this._frameSpeed + 1)) {
      this._currentFrame = (this._currentFrame + 1) % this._animationSequence.length;
    }

    this._counter = (this._counter + 1) % this._frameSpeed;
  }

  draw(context, x, y) {
    const currentAnimationFrame = this._animationSequence[this._currentFrame];
    const row = Math.floor(currentAnimationFrame / this._sprite.framesPerRow);
    const col = Math.floor(currentAnimationFrame % this._sprite.framesPerRow);
    const offsetX = col * this._sprite.frameWidth;
    const offsetY = row * this._sprite.frameHeight;

    context.drawImage(
      this._sprite.image,
      offsetX, offsetY,
      this._sprite.frameWidth, this._sprite.frameHeight,
      x, y,
      this._sprite.frameWidth, this._sprite.frameHeight);
  }
}

module.exports = Animation;
