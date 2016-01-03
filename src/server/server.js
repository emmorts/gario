/* global Buffer */
/* global __dirname */

let Player = require('./Player');
let util = require('./util');
let BufferUtil = require('concentrate');
let GameServer = require('./gameServer');

let server = require('http').createServer();
let express = require('express');
let app = express();

let config = require('./config');
var OPCode = require('../opCode');

let users = [];
let massFood = [];
let food = [];
let virus = [];
let sockets = {};

let leaderboard = [];
let leaderboardChanged = false;

let updateRate = 1000 / 60;

// wss.on('connection', function connection (socket) {
  
//   if (users.length >= config.maxConnections) {
//     console.log("Server is full");
//     wss.close();
//     return;
//   }
  
//   let player = new Player();
  
//   console.log("Sending synchronise...");
//   socket.send(BufferUtil().uint8(OPCode.SYN).result());

//   socket.on('message', function incoming (message) {

//     switch (message[0]) {
//       case OPCode.ACK:
//         console.log("Socket connection acknowledged");
//         sockets[player.id] = socket;
//         socket.send(BufferUtil()
//           .uint8(OPCode.JOINED)
//           .string(player.id)
//           .result()
//         );
//         break;
//       case OPCode.SPAWN:
//         let buffers = [];
        
//         users.push(player.reset());
//         console.log("Spawn player %s", player.id);
        
//         buffers.push(BufferUtil()
//           .uint8(OPCode.UPLAYERS)
//           .uint8(users.length)
//           .result());
//         buffers = buffers.concat(users.map(user => user.bufferize()));
//         let totalLength = buffers.reduce((len, buffer) => len + buffer.length, 0);
//         socket.send(Buffer.concat(buffers, totalLength));
//         break;
//       default:
//         console.log("Undefined opcode %s", message[0]);
//         break;
//     }

//   });
  
//   socket.on('close', function () {
//     for (var id in sockets) {
//       var playerId = null;
//       if (sockets[id] == socket) {
//         playerId = id;
//       }
//       if (playerId) {
//         delete sockets[id];
//         for (var i = 0; i < users.length; i++) {
//           if (users[i].id === playerId) {
//             users.splice(i, 1);
//           }
//         }
//         console.log('Player %s left', playerId);
//       }
//     }
//   });
  
//   socket.on('error', function (error) {
//     console.log("[Error] Unhandled error code: " + error.code);
//     process.exit(1);
//   });

// });

var gameServer = new GameServer(server);
gameServer.start();

app.use(express['static'](__dirname + '/../dist'));

server.on('request', app);
server.listen(config.port, () => console.log('Listening on ' + server.address().port));