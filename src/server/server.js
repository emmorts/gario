/* global Buffer */
/* global __dirname */

let GameServer = require('./gameServer');

let server = require('http').createServer();
let express = require('express');
let app = express();

let config = require('./config');

var gameServer = new GameServer(server);
gameServer.start();

app.use(express['static'](__dirname + '/../dist'));

server.on('request', app);
server.listen(config.port, () => console.log('Listening on ' + server.address().port));