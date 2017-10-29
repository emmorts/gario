const Sprite = require('common/Sprite');

module.exports = {
  [Sprite.FLAT]: require('client/sprites/FlatSprite'),
  [Sprite.LAVA]: require('client/sprites/LavaSprite'),
};
