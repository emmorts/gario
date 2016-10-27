require('client/util/polyfills');

const OPCode = require('common/opCode');
const KeyCode = require('client/util/KeyCode');
const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');

const game = Game.getInstance();

new StartMenuElement().on('startGame', startGame);

function startGame (playerName) {
  const canvas = new CanvasElement()
    .on('playerMove', target => {
      if (game.currentPlayer.health > 0) {
        game.currentPlayer.setTarget({
          x: target.x,
          y: target.y
        });
        game.packetHandler.send(OPCode.PLAYER_MOVE, game.currentPlayer);
      }
    });

  game.renderer = canvas.renderer;

  game.startGame(playerName, () => {
    window.document.addEventListener('keydown', wHandleKeyDown);
  });

  function wHandleKeyDown(event) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        if (game.currentPlayer.health > 0) {
          game.packetHandler.send(OPCode.CAST_SPELL, {
            type: OPCode.SPELL_PRIMARY,
            playerX: game.currentPlayer.position.x,
            playerY: game.currentPlayer.position.y,
            x: canvas._mousePosition.x, //hack
            y: canvas._mousePosition.y
          });
        }
    }
  }
}