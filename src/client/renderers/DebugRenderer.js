const IRenderer = require('client/renderers/IRenderer');
const CanvasHelper = require('client/util/CanvasHelper');

class DebugRenderer extends IRenderer {
  static draw(game, renderer, deltaT) {
    DebugRenderer._drawDebugInformation(game, renderer, deltaT);
    DebugRenderer._drawPlayerTargetTracer(game, renderer);
    DebugRenderer._drawPlayerInformation(game, renderer);
  }

  static _drawDebugInformation(game, renderer, deltaT) {
    const currentPlayerPosition = game.currentPlayer
      ? game.currentPlayer.position
      : { x: 'N/A', y: 'N/A' };

    CanvasHelper.text(renderer.context, {
      text: `Camera: ${Math.round(renderer.camera.scrollX)} ${Math.round(renderer.camera.scrollY)}`,
      x: 30,
      y: 30,
    });

    CanvasHelper.text(renderer.context, {
      text: `Coordinates: ${Math.round(currentPlayerPosition.x)} ${Math.round(currentPlayerPosition.y)}`,
      x: 30,
      y: 50,
    });

    CanvasHelper.text(renderer.context, {
      text: `Player Camera: ${Math.round(renderer.camera.offsetX)} ${Math.round(renderer.camera.offsetY)}`,
      x: 30,
      y: 70,
    });

    CanvasHelper.text(renderer.context, {
      text: `Players Online: ${game.playerList.length}`,
      x: 30,
      y: 90,
    });

    CanvasHelper.text(renderer.context, {
      text: `Ping: ${game.ping}`,
      x: 30,
      y: 110,
    });

    CanvasHelper.text(renderer.context, {
      text: `FPS: ${(1000 / deltaT) | 0}`,
      x: 30,
      y: 130,
    });
  }

  static _drawPlayerInformation(game, renderer) {
    CanvasHelper.text(renderer.context, {
      text: `Health: ${game.currentPlayer ? Math.round(game.currentPlayer.health) : 'N/A'}`,
      x: 30,
      y: renderer.camera.height - 30,
    });
  }

  static _drawPlayerTargetTracer(game, renderer) {
    const currentPlayer = game.currentPlayer;

    const startX = 0 - renderer.camera.scrollX;
    const startY = 0 - renderer.camera.scrollY;

    if (currentPlayer && currentPlayer.target && currentPlayer.position) {
      const targetX = startX + currentPlayer.target.x;
      const targetY = startY + currentPlayer.target.y;
      const positionX = startX + currentPlayer.position.x;
      const positionY = startY + currentPlayer.position.y;

      if (currentPlayer.target.distanceTo(currentPlayer.position) > 10) {
        renderer.context.setLineDash([10, 15]);
        renderer.context.strokeStyle = 'rgb(207, 69, 69)';

        renderer.context.beginPath();
        renderer.context.moveTo(targetX, targetY);
        renderer.context.lineTo(positionX, positionY);
        renderer.context.stroke();

        CanvasHelper.arc(renderer.context, {
          x: targetX,
          y: targetY,
          radius: 5,
          fillColor: 'rgb(207, 69, 69)',
        });

        renderer.context.setLineDash([]);
      }
    }
  }
}

module.exports = DebugRenderer;
