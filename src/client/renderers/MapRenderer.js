const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class MapRenderer extends IRenderer {
  static draw(model, renderer) {
    const scrollX = renderer.camera.scrollX;
    const scrollY = renderer.camera.scrollY;
    const startX = (renderer.width - model.width) / 2 - scrollX;
    const startY = (renderer.height - model.height) / 2 - scrollY;

    CanvasHelper.square(renderer.context, {
      x: startX,
      y: startY,
      width: model.width,
      height: model.height,
      strokeWidth: 2,
      strokeColor: 'rgb(69, 69, 69)',
      fillColor: 'rgb(225, 225, 225)'
    });
  }
}

module.exports = MapRenderer;