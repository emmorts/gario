const Sprite = require('common/Sprite');
const SpriteBase = require('client/sprites/SpriteBase');

let instance = null;

class LavaSprite extends SpriteBase {
  constructor() {
    super(Sprite.LAVA, 'lava.png', 512, 512);

    this.color = 'rgb(128, 69, 69)';

    if (!instance) {
      instance = this;
    }

    return instance;
  }
}

module.exports = LavaSprite;
