require('client/util/polyfills');

const present = require('present');
const OPCode = require('opCode');
const KeyCode = require('client/util/KeyCode');
const DomElement = require('client/util/DomElement');
const Graph = require('client/Graph');
const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');

var animationLoopHandle;
var lastUpdate;
var mousePosition = { x: 0, y: 0 };
var scrollDirection = null;
var game = Game.getInstance();

new StartMenuElement().bind().on('startGame', startGame);
let canvas = null;

function animationLoop(timestamp) {
  animationLoopHandle = window.requestAnimationFrame(animationLoop);

  gameLoop(timestamp - lastUpdate);
  lastUpdate = timestamp;
}

function gameLoop(deltaT) {
  canvas.graph
    .clear()
    .updateOffset(scrollDirection)
    .drawGrid()
    .drawArena()
    .drawSpells(game.spellList)
    .drawPlayers(game.playerList)
    .drawDebug();

  game.update();
}

function startGame (playerName) {
  game.startGame(playerName, () => {
    window.document.addEventListener('keydown', wHandleKeyDown);

    canvas = new CanvasElement()
      .bind()
      .bindEvents()
      .on('mouseMove', mouse => {
        mousePosition = { x: mouse.x, y: mouse.y };
        scrollDirection = mouse.direction;
      })
      .on('playerMove', target => {
        game.currentPlayer.setTarget(target);
        game.controller.send(OPCode.PLAYER_MOVE, game.currentPlayer);
      });
      
    if (!animationLoopHandle) {
      lastUpdate = present();
      animationLoop(lastUpdate);
    }
  });

  game.on('addPlayer', () => canvas.graph.player = game.currentPlayer);

  function wHandleKeyDown(event) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        game.controller.send(OPCode.CAST_SPELL, {
          type: OPCode.SPELL_PRIMARY,
          playerX: game.currentPlayer.position.x,
          playerY: game.currentPlayer.position.y,
          x: mousePosition.x,
          y: mousePosition.y
        });
    }
  }
}