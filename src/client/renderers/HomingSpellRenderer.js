const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class HomingSpellRenderer extends IRenderer {
  static draw(model, renderer) {
    const posX = model.position.x - renderer.camera.scrollX;
    const posY = model.position.y - renderer.camera.scrollY;

    CanvasHelper.arc(renderer.context, {
      x: posX,
      y: posY,
      radius: model.radius,
      fillColor: HomingSpellRenderer._getColorInRGB(model.color),
    });
  }

  static _getColorInRGB(color) {
    if (color) {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    return 'rgb(0, 0, 0)';
  }
}

module.exports = HomingSpellRenderer;
