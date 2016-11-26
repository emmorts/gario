require('client/util/polyfills');

const Game = require('client/Game');
const StartMenuElement = require('client/elements/StartMenuElement');
const CanvasElement = require('client/elements/CanvasElement');
const Camera = require('client/Camera');
const MapRenderer = require('client/MapRenderer');
const GameObjectRenderer = require('client/GameObjectRenderer');
const InputHandler = require('client/InputHandler');

new StartMenuElement().on('startGame', (playerName) => {
  const mapCanvas = new CanvasElement('.js-map-canvas');
  const goCanvas = new CanvasElement('.js-gameobject-canvas');
  const camera = new Camera(goCanvas.width, goCanvas.height);
  const mapRenderer = new MapRenderer(mapCanvas.context, camera);
  const goRenderer = new GameObjectRenderer(goCanvas.context, camera);

  InputHandler.attachCamera(camera);

  goCanvas.on('resize', (dimensions) => {
    camera.width = dimensions.width;
    camera.height = dimensions.height;
  });

  Game
    .setMapRenderer(mapRenderer)
    .setGameObjectRenderer(goRenderer)
    .on('playerSpawned', player => camera.follow(player))
    .startGame(playerName, camera);
});
