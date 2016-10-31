/* global __dirname */

const modulePath = require('app-module-path');

modulePath.addPath(`${__dirname}/../`);

const GameServer = require('server/GameServer');
const express = require('express');
const server = require('http').createServer();

const app = express();

const config = require('server/config');

new GameServer(server).start();

app.use(express.static(`${__dirname}/../../dist`));

server.on('request', app);
server.listen(config.port, () => console.log(`Listening on ${server.address().port}`));
