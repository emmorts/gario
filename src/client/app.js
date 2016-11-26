require('client/util/polyfills');

const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');

const game = Game.getInstance();

function startGame(playerName) {
  const canvas = new CanvasElement('.js-gameobject-canvas');

  game.renderer = canvas.renderer;

  game.startGame(playerName);
}

new StartMenuElement().on('startGame', startGame);
