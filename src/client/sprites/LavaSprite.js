const Sprite = require('client/sprites/Sprite');

class LavaSprite extends Sprite {
  constructor() {
    super('lava.png', 512, 512);
  }
}

module.exports = LavaSprite;
