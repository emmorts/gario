const EventEmitter = require('common/EventEmitter');
const SpriteBase = require('client/sprites/SpriteBase');

let instance = null;

class SpriteLoader {
  constructor() {
    if (!instance) {
      instance = this;
    }

    EventEmitter.attach(this);

    this.assets = {};

    return instance;
  }

  get(code) {
    if (code in this.assets) {
      return this.assets[code];
    }

    return null;
  }

  load(items) {
    return new Promise((resolve) => {
      let spritesToLoad = [];

      if (Array.isArray(items)) {
        spritesToLoad = items.filter(item => item instanceof SpriteBase);
      } else if (items instanceof SpriteBase) {
        spritesToLoad.push(items);
      } else {
        resolve();
      }

      this._startLoading(spritesToLoad).then((loadedSprites) => {
        const result = [];

        if (loadedSprites && loadedSprites.length) {
          loadedSprites.forEach((sprite) => {
            this.assets[sprite.code] = sprite;

            result.push(sprite);
          });
        }

        resolve(result);
      });
    });
  }

  _startLoading(items) {
    return new Promise((resolve) => {
      if (items.length) {
        Promise
          .all(items.map(item => item.load()))
          .then(resolve);
      } else {
        resolve();
      }
    });
  }
}

module.exports = new SpriteLoader();
