
import GameServer from 'server/GameServer';
import * as express from 'express';
import { createServer } from 'http';
import config from 'server/config';
import { register } from 'server/api/controllers';
import Logger from 'server/Logger';

const server = createServer();
const app = express();

register(app);

new GameServer(server).start();

server.on('request', app);
server.listen(config.port, () => {
  Logger.info(`Listening on ${config.port}`);
});
