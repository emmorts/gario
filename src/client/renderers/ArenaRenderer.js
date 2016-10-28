const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

const MapTiles = require('client/mapTiles/');
const Tileset = require('common/Tileset');

class ArenaRenderer extends IRenderer {
  static draw(model, renderer) {
    const scrollX = renderer.camera.scrollX;
    const scrollY = renderer.camera.scrollY;

    const startX = 0 - scrollX;
    const startY = 0 - scrollY;

    const map = model.map;
    const tileSize = model.tileSize;

    renderer.context.fillStyle = MapTiles[Tileset.LAVA].color;
    renderer.context.fillRect(0, 0, renderer.width, renderer.height);

    for (let rowIndex in map) {
      for (let columnIndex in map[rowIndex]) {
        const tileStartX = startX + tileSize * columnIndex;
        const tileStartY = startY + tileSize * rowIndex;
        const tileType = map[rowIndex][columnIndex];
        if (tileType != Tileset.LAVA){
          CanvasHelper.square(renderer.context, {
          x: tileStartX,
          y: tileStartY,
          width: tileSize + 1,
          height: tileSize + 1,
          fillColor: MapTiles[tileType].color
        });
        } 
      };
    }
  }
}

module.exports = ArenaRenderer;