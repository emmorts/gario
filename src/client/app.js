require('client/util/polyfills');

const present = require('present');
const OPCode = require('opCode');
const KeyCode = require('client/util/KeyCode');
const DomElement = require('client/util/DomElement');
const Graph = require('client/Graph');
const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');

const game = Game.getInstance();

new StartMenuElement().bind().on('startGame', startGame);

let animationLoopHandle;
let lastUpdate;
let scrollDirection = null;
let canvas = null;

const mousePosition = { x: 0, y: 0 };

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
    .drawDebug()
    .drawStatus();

  game.update();
}

function startGame (playerName) {
  game.startGame(playerName, () => {
    window.document.addEventListener('keydown', wHandleKeyDown);

    canvas = new CanvasElement()
      .bind()
      .bindEvents()
      .on('mouseMove', mouse => {
        mousePosition.x = mouse.x;
        mousePosition.y = mouse.y;
        scrollDirection = mouse.direction;
      })
      .on('playerMove', target => {
        if (game.currentPlayer.health > 0) {
          game.currentPlayer.setTarget(target);
          game.controller.send(OPCode.PLAYER_MOVE, game.currentPlayer);
        }
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
        if (game.currentPlayer.health > 0) {
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
}