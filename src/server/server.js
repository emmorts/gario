/* global __dirname */

let QuadTree = require('./quadtree');
let SAT = require('sat');

let server = require('http').createServer();
let url = require('url');
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ server: server });
let express = require('express');
let app = express();

let config = require('./config');
var OPCode = require('../opCode');

let args = { x : 0, y : 0, h : config.gameHeight, w : config.gameWidth, maxChildren : 1, maxDepth : 5 };
let tree = QuadTree.QUAD.init(args);

let users = [];
let massFood = [];
let food = [];
let virus = [];
let sockets = {};

let leaderboard = [];
let leaderboardChanged = false;

let Vector = SAT.Vector;
let Circle = SAT.Circle;

wss.on('connection', function connection (socket) {
  
  let array = new Uint8Array(1);
  array[0] = OPCode.SYN;
  socket.send(array.buffer, { binary: true });
  
  socket.on('message', function incoming (message) {
    
    switch (message[0]) {
      case OPCode.ACK:
        array = new Uint8Array(1);
        array[0] = OPCode.JOINED;
        socket.send(array.buffer, { binary: true });
        break;
      default:
        console.log("Undefined opcode %s", message[0]);
        break;
    }
    
  });
  
});

app.use(express['static'](__dirname + '/../client'));

server.on('request', app);
server.listen(config.port, () => console.log('Listening on ' + server.address().port));