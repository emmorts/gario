/* global __dirname */

const modulePath = require('app-module-path');

modulePath.addPath(`${__dirname}/../`);

const GameServer = require('server/GameServer');
const express = require('express');
const server = require('http').createServer();
const config = require('server/config');
const controllers = require('server/api/controllers');
const Logger = require('server/Logger');

const app = express();

controllers.register(app);

new GameServer(server).start();

server.on('request', app);
server.listen(config.port, () => Logger.info(`Listening on ${server.address().port}`));
