const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class PlayerRenderer extends IRenderer {
  static draw(model, renderer) {
    const posX = model.position.x - renderer.camera.scrollX;
    const posY = model.position.y - renderer.camera.scrollY;

    const playerColor = PlayerRenderer._getColorInRGB(model.color);
    const arcLength = 2 * (model.health / model.maxHealth) * Math.PI;
    const deficit = (2 * Math.PI - arcLength) / 2;
    const arcStart = model.rotation + deficit;
    const arcEnd = arcLength + model.rotation + deficit;

    CanvasHelper.arc(renderer.context, {
      x: posX,
      y: posY,
      radius: model.radius,
      fillColor: model.health > 0 ? playerColor : 'rgb(69, 69, 69)'
    });

    CanvasHelper.arc(renderer.context, {
      x: posX,
      y: posY,
      radius: model.radius - 3,
      start: arcStart,
      end: arcEnd,
      strokeWidth: 6,
      strokeColor: PlayerRenderer._getHealthColor(model.health, model.maxHealth)
    });

    CanvasHelper.text(renderer.context, {
      text: model.name,
      x: posX,
      y: posY - 40,
      borderWidth: 3,
      textAlign: 'center'
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Coordinates: ${Math.round(model.position.x)} ${Math.round(model.position.y)}`,
      x: 30,
      y: 50
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Camera: ${Math.round(renderer.camera.scrollX)} ${Math.round(renderer.camera.scrollY)}`,
      x: 30,
      y: 30
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Hidden Camera: ${Math.round(renderer.camera._offsetX)} ${Math.round(renderer.camera._offsetY)}`,
      x: 30,
      y: 70
    });
  }

  static _getColorInRGB(color) {
    if (color) {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    return 'rgb(0, 0, 0)';
  }
  
  static _getHealthColor(health, maxHealth) {
    const hue = Math.floor(120 * health / maxHealth);

    return `hsl(${hue}, 100%, 50%)`;
  }
}

module.exports = PlayerRenderer;