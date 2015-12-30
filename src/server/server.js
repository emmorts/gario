/* global Buffer */
/* global __dirname */

let QuadTree = require('./quadtree');
let SAT = require('sat');
let Player = require('./Player');
let util = require('./util');
let BufferUtil = require('concentrate');

let server = require('http').createServer();
let url = require('url');
let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ server: server });
let express = require('express');
let app = express();

let config = require('./config');
var OPCode = require('../opCode');

let args = { x: 0, y: 0, h: config.gameHeight, w: config.gameWidth, maxChildren: 1, maxDepth: 5 };
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
  
  let player = new Player();
  
  console.log("Sending synchronise...");
  socket.send(BufferUtil().uint8(OPCode.SYN).result());

  socket.on('message', function incoming (message) {

    switch (message[0]) {
      case OPCode.ACK:
        console.log("Socket connection acknowledged");
        sockets[player.id] = socket;
        socket.send(BufferUtil().uint8(OPCode.JOINED).result());
        break;
      case OPCode.SPAWN:
        let buffers = [];
        
        users.push(player.reset());
        console.log("Spawn player %s", player.id);
        
        buffers.push(BufferUtil()
          .uint8(OPCode.UPLAYERS)
          .uint8(users.length)
          .result());
        buffers = buffers.concat(users.map(user => user.bufferize()));
        let totalLength = buffers.reduce((len, buffer) => len + buffer.length, 0);
        socket.send(Buffer.concat(buffers, totalLength));
        break;
      default:
        console.log("Undefined opcode %s", message[0]);
        break;
    }

  });

});

app.use(express['static'](__dirname + '/../dist'));

server.on('request', app);
server.listen(config.port, () => console.log('Listening on ' + server.address().port));