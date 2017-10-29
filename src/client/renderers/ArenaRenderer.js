const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

const SpriteLoader = require('client/SpriteLoader');
const Sprites = require('client/sprites');
const Sprite = require('common/Sprite');

const spritesToLoad = [
  new Sprites[Sprite.FLAT](),
  new Sprites[Sprite.LAVA](),
];

let spritesLoaded = false;

SpriteLoader
  .load(spritesToLoad)
  .then(() => {
    spritesLoaded = true;
  });

class ArenaRenderer extends IRenderer {
  static draw(model, renderer) {
    const scrollX = renderer.camera.scrollX;
    const scrollY = renderer.camera.scrollY;
    const cameraWidth = renderer.camera.width;
    const cameraHeight = renderer.camera.height;

    const startX = 0 - scrollX;
    const startY = 0 - scrollY;

    const map = model.tiledMap;
    const tileSize = model.tileSize;

    const lavaSprite = SpriteLoader.get(Sprite.LAVA);

    for (let i = startX - cameraWidth; i <= cameraWidth; i += lavaSprite.frameWidth) {
      for (let j = startY - cameraHeight; j <= cameraHeight; j += lavaSprite.frameHeight) {
        renderer.context.drawImage(lavaSprite.image,
          i, j,
          lavaSprite.frameWidth, lavaSprite.frameHeight
        );
      }
    }

    if (spritesLoaded) {
      map.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const sprite = SpriteLoader.get(column);

          const dX = startX + (rowIndex * tileSize);
          const dY = startY + (columnIndex * tileSize);

          renderer.context.drawImage(sprite.image,
            rowIndex * tileSize % sprite.frameWidth, columnIndex * tileSize % sprite.frameHeight,
            tileSize, tileSize,
            dX, dY,
            tileSize, tileSize
          );

          // CanvasHelper.text(renderer.context, {
          //   text: `${rowIndex}:${columnIndex}`,
          //   fontSize: 9,
          //   textAlign: 'center',
          //   x: dX + (tileSize / 2),
          //   y: dY + (tileSize / 2),
          // });
        });
      });
    }
  }
}

module.exports = ArenaRenderer;
