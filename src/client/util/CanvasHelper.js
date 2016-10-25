const canvasConfig = require('client/config/canvasConfig');

class CanvasHelper {
  static square(canvasContext, properties) {
    if (canvasContext && properties) {
      if (properties.fillColor) {
        canvasContext.fillStyle = properties.fillColor;
        canvasContext.fillRect(properties.x, properties.y, properties.width, properties.height);
      }
      
      if (properties.strokeColor) {
        canvasContext.lineWidth = properties.strokeWidth;
        canvasContext.strokeStyle = properties.strokeColor;
        canvasContext.strokeRect(properties.x, properties.y, properties.width, properties.height);
      }
    }
  }

  static arc(canvasContext, properties) {
    if (canvasContext && properties) {
      properties.start = properties.start || 0;
      properties.end = properties.end || 2 * Math.PI;
      
      canvasContext.beginPath();

      canvasContext.arc(properties.x, properties.y, properties.radius, properties.start, properties.end);

      if (properties.fillColor) {
        canvasContext.fillStyle = properties.fillColor;
        canvasContext.fill();
      }

      if (properties.strokeWidth) {
        canvasContext.lineWidth = properties.strokeWidth;
      }

      if (properties.strokeColor) {
        canvasContext.strokeStyle = properties.strokeColor;
        canvasContext.stroke();
      }

      canvasContext.closePath();
    }
  }

  static text(canvasContext, properties) {
    if (canvasContext && properties) {
      properties.fontSize = properties.fontSize || canvasConfig.fontSize;
      properties.fontWeight = properties.fontWeight || canvasConfig.fontWeight;
      properties.fontColor = properties.fontColor || canvasConfig.fontColor;
      properties.borderWidth = properties.borderWidth || canvasConfig.textBorderWidth;
      properties.borderColor = properties.borderColor || canvasConfig.textBorderColor;
      properties.miterLimit = properties.miterLimit || canvasConfig.miterLimit;
      properties.lineJoin = properties.lineJoin || canvasConfig.lineJoin;
      properties.textBaseline = properties.textBaseline || canvasConfig.textBaseline;
      properties.textAlign = properties.textAlign || canvasConfig.textAlign;

      canvasContext.font = `${properties.fontWeight}  ${properties.fontSize}px sans-serif`;
      canvasContext.fillStyle = properties.fontColor;
      canvasContext.miterLimit = properties.miterLimit;
      canvasContext.lineJoin = properties.lineJoin;
      canvasContext.textBaseline = properties.textBaseline;
      canvasContext.textAlign = properties.textAlign;

      if (properties.borderWidth) {
        canvasContext.strokeStyle = properties.borderColor;
        canvasContext.lineWidth = properties.borderWidth;
        canvasContext.strokeText(properties.text, properties.x, properties.y);
      }

      canvasContext.fillText(properties.text, properties.x, properties.y);
    }
  }
  
}

module.exports = CanvasHelper;