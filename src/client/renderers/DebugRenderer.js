const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class DebugRenderer extends IRenderer {
  static draw(game, renderer) {
    const currentPlayerPosition = game.currentPlayer
      ? game.currentPlayer.position
      : { x: 'N/A', y: 'N/A' };
    
    CanvasHelper.text(renderer.context, {
      text: `Camera: ${Math.round(renderer.camera.scrollX)} ${Math.round(renderer.camera.scrollY)}`,
      x: 30,
      y: 30
    });

    CanvasHelper.text(renderer.context, {
      text: `Coordinates: ${Math.round(currentPlayerPosition.x)} ${Math.round(currentPlayerPosition.y)}`,
      x: 30,
      y: 50
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Player Camera: ${Math.round(renderer.camera.offsetX)} ${Math.round(renderer.camera.offsetY)}`,
      x: 30,
      y: 70
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Players Online: ${game.playerList.length}`,
      x: 30,
      y: 90
    });
    
    CanvasHelper.text(renderer.context, {
      text: `Ping: ${game.ping}`,
      x: 30,
      y: 110
    });
  }
}

module.exports = DebugRenderer;