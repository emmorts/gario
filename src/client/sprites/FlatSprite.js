const Sprite = require('common/Sprite');
const SpriteBase = require('client/sprites/SpriteBase');

let instance = null;

class FlatSprite extends SpriteBase {
  constructor() {
    super(Sprite.FLAT, 'ground.jpg', 512, 512);

    this.color = 'rgb(69, 69, 69)';

    if (!instance) {
      instance = this;
    }

    return instance;
  }
}

module.exports = FlatSprite;
