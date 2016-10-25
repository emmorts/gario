require('client/util/polyfills');

const present = require('present');
const OPCode = require('common/opCode');
const KeyCode = require('client/util/KeyCode');
const DomElement = require('client/util/DomElement');
const Graph = require('client/Graph');
const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');
const GameRenderer = require('client/GameRenderer');

const game = Game.getInstance();

new StartMenuElement().bind().on('startGame', startGame);

let animationLoopHandle;
let lastUpdate;
let scrollDirection = null;
let canvas = null;
let gameRenderer = null;

const mousePosition = { x: 0, y: 0 };

function animationLoop(timestamp) {
  animationLoopHandle = window.requestAnimationFrame(animationLoop);

  gameLoop(timestamp - lastUpdate);
  lastUpdate = timestamp;
}

// TODO: Remove this
const Map = require('client/maps/Map');
const mapObject = new Map();

function gameLoop(deltaT) {

  // canvas.graph
  //   .clear()
  //   .updateOffset(scrollDirection)
  //   .drawGrid()
  //   // .drawArena()
  //   .drawSpells(game.spellList)
  //   // .drawPlayers(game.playerList)
  //   .drawDebug(game.ping)
  //   .drawStatus();

  gameRenderer.add(mapObject);
  game.spellList.forEach(player => gameRenderer.add(player));
  game.playerList.forEach(player => gameRenderer.add(player));
  gameRenderer.draw(deltaT);
  gameRenderer.camera.update(scrollDirection);

  game.update();
}

function startGame (playerName) {
  game.startGame(playerName, () => {
    window.document.addEventListener('keydown', wHandleKeyDown);

    canvas = new CanvasElement()
      .bind()
      .bindEvents()
      .on('mouseMove', mouse => {
        mousePosition.x = mouse.x + gameRenderer.camera.scrollX;
        mousePosition.y = mouse.y + gameRenderer.camera.scrollY;
        scrollDirection = mouse.direction;
      })
      .on('playerMove', target => {
        if (game.currentPlayer.health > 0) {
          game.currentPlayer.setTarget({
            x: target.x + gameRenderer.camera.scrollX,
            y: target.y + gameRenderer.camera.scrollY
          });
          game.packetHandler.send(OPCode.PLAYER_MOVE, game.currentPlayer);
        }
      });

    gameRenderer = new GameRenderer(canvas.graph._context);
      
    if (!animationLoopHandle) {
      lastUpdate = present();
      animationLoop(lastUpdate);
    }
  });

  game.on('addPlayer', () => {
    canvas.graph.player = game.currentPlayer;
    gameRenderer.camera.follow(game.currentPlayer);
  });

  function wHandleKeyDown(event) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        if (game.currentPlayer.health > 0) {
          game.packetHandler.send(OPCode.CAST_SPELL, {
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