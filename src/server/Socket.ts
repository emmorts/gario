import { WebSocket } from 'ws';
import PacketHandler from 'server/PacketHandler';
import PlayerController from 'server/PlayerController';

export type Socket = WebSocket & {
  packetHandler: PacketHandler,
  playerController: PlayerController
};