require('./util/polyfills');

const OPCode = require('../../opCode');

import KeyCode from './util/KeyCode';
import DomElement from './util/DomElement';
import Graph from './Graph';
import Game from './Game';
import * as Statistics from './statistics';

var animationLoopHandle;
var lastUpdate;
var targetTick = performance.now();
var mouse = { x: 0, y: 0 };
var scrollDirection = null;
var game = Game.getInstance();

var canvas = new DomElement('.js-canvas', Graph);
var graph = canvas.instance;

var playerNameElement = new DomElement('.js-player-name');
var playButtonElement = new DomElement('.js-play-button');
var errorElement = new DomElement('.js-error');

if (playButtonElement.htmlElement) {
  playButtonElement.on('mouseup', startGame);
}

if (playerNameElement.htmlElement) {
  playerNameElement.on('keyup', validate);
}

function validate(event) {
  if (~[KeyCode.ENTER, KeyCode.MAC_ENTER].indexOf(event.keyCode)) {
    startGame();
  } else {
    var pattern = /^[a-zA-Z0-9 ]{0,25}$/;
    if (event.target.value.match(pattern)) {
      errorElement.htmlElement.style.display = 'none';
      playButtonElement.htmlElement.disabled = false;
    } else {
      errorElement.htmlElement.style.display = 'block';
      playButtonElement.htmlElement.disabled = true;
    }
  }
}

function animationLoop(timestamp) {
  animationLoopHandle = window.requestAnimationFrame(animationLoop);
  
  gameLoop(timestamp - lastUpdate);
  lastUpdate = timestamp;
}

function gameLoop(deltaT) {
  graph
    .clear()
    .updateOffset(scrollDirection)
    .drawGrid()
    .drawArena()
    .drawSpells(game.spellList)
    .drawPlayers(game.playerList)
    .drawDebug();
    
  game.update();
}

function startGame () {
  new DomElement('.js-start-menu').htmlElement.style.display = 'none';
  
  game.startGame(playerNameElement.htmlElement.value, () => {
    window.document.addEventListener('keydown', wHandleKeyDown);
    
    canvas.on('contextmenu', event => event.preventDefault());
    canvas.on('mousemove', cHandleMouseMove);
    canvas.on('mousedown', cHandleMouseDown);
  });
  
  game.on('addPlayer', () => graph.player = game.currentPlayer);
  
  if (!animationLoopHandle) {
    lastUpdate = Date.now();
    animationLoop(lastUpdate);
  }
  
  function cHandleMouseMove(event) {
    var westBreakpoint = graph.screenWidth / 10,
        eastBreakpoint = graph.screenWidth * 9 / 10,
        northBreakpoint = graph.screenHeight / 10,
        southBreakpoint = graph.screenHeight * 9 / 10;
        
    if (event.x < westBreakpoint && event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NWEST;
    } else if (event.x > eastBreakpoint && event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NEAST;
    } else if (event.x < westBreakpoint && event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SWEST;
    } else if (event.x > eastBreakpoint && event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SEAST;
    } else if (event.x < westBreakpoint) {
      scrollDirection = OPCode.DIRECTION_WEST;
    } else if (event.x > eastBreakpoint) {
      scrollDirection = OPCode.DIRECTION_EAST;
    } else if (event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NORTH;
    } else if (event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SOUTH;
    } else {
      scrollDirection = null;
    }
    mouse.x = event.x;
    mouse.y = event.y;
  }
  
  function cHandleMouseDown(event) {
    if (game.currentPlayer && event.button === KeyCode.MOUSE2) {
      event.preventDefault();
      event.stopPropagation();
      var now = performance.now();
      var diff = now - targetTick;
      if (diff > 100) {
        var targetX = mouse.x + graph.xOffset;
        var targetY = mouse.y + graph.yOffset;
        targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
        targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
        game.currentPlayer.setTarget({ x: targetX, y: targetY});
        targetTick = now;
        game.controller.move(game.currentPlayer);
      }
    }
  }
  
  function wHandleKeyDown(event) {
    switch (event.keyCode) {
      case KeyCode.Q:
        game.controller.cast(OPCode.CAST_PRIMARY, {
          playerX: game.currentPlayer.position.x,
          playerY: game.currentPlayer.position.y,
          x: mouse.x + graph.xOffset,
          y: mouse.y + graph.yOffset
        });
        //For testing purposes only
        const scoreHolder = Statistics.Score.getInstance();
        scoreHolder.add();
        console.log(scoreHolder.currentScore());
        break;
    }
  }
}