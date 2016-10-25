const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class PrimaryRenderer extends IRenderer {
  static draw(model, renderer) {
    const posX = model.position.x - renderer.camera.scrollX;
    const posY = model.position.y - renderer.camera.scrollY;

    CanvasHelper.arc(renderer.context, {
      x: posX,
      y: posY,
      radius: model.radius,
      fillColor: PrimaryRenderer._getColorInRGB(model.color)
    });
    
  }

  static _getColorInRGB(color) {
    if (color) {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    return 'rgb(0, 0, 0)';
  }
}

module.exports = PrimaryRenderer;