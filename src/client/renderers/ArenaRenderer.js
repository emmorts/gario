const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

const MapTiles = require('client/mapTiles');
const Tileset = require('common/Tileset');

let spritesLoaded = false;

const LavaSprite = new Image();
LavaSprite.src = `sprites/lava.png`;

LavaSprite.addEventListener('load', () => {
  spritesLoaded = true;
}, false);

class ArenaRenderer extends IRenderer {
  static draw(model, renderer) {
    const scrollX = renderer.camera.scrollX;
    const scrollY = renderer.camera.scrollY;

    const startX = 0 - scrollX;
    const startY = 0 - scrollY;

    const map = model.tiledMap;
    const tileSize = model.tileSize;

    if (spritesLoaded) {
      for (let i = 0; i <= 4; i++) {
        for (let j = 0; j <= 4; j++) {
          renderer.context.drawImage(LavaSprite, startX + (i * 512) - 512, startY + (j * 512) - 512);
        }
      }
    }

    // renderer.context.fillStyle = MapTiles[Tileset.LAVA].color;
    // renderer.context.fillRect(0, 0, renderer.width, renderer.height);

    map.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const tileStartX = startX + (tileSize * columnIndex);
        const tileStartY = startY + (tileSize * rowIndex);
        const tileType = map[rowIndex][columnIndex];

        if (tileType !== Tileset.LAVA) {
          CanvasHelper.square(renderer.context, {
            x: tileStartX | 0,
            y: tileStartY | 0,
            width: tileSize + 1,
            height: tileSize + 1,
            fillColor: MapTiles[tileType].color,
          });
        }

        // CanvasHelper.text(renderer.context, {
        //   text: `${rowIndex}:${columnIndex}`,
        //   fontSize: 9,
        //   textAlign: 'center',
        //   x: tileStartX + (tileSize / 2),
        //   y: tileStartY + (tileSize / 2),
        // });
      });
    });
  }
}

module.exports = ArenaRenderer;
