/* global __dirname */

const modulePath = require('app-module-path');
modulePath.addPath(__dirname);
modulePath.addPath('../');

const GameServer = require('./GameServer');

const server = require('http').createServer();
const express = require('express');
const app = express();

const config = require('./config'); 

new GameServer(server).start();

app.use(express['static'](__dirname + '/../dist'));

server.on('request', app);
server.listen(config.port, () => console.log('Listening on ' + server.address().port));