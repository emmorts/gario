import * as ws from 'ws';
import Action from './Action';
import { OperationCode } from 'common/OperationCode';

import AddPlayer from 'server/actions/AddPlayer';
import CastSpell from 'server/actions/CastSpell';
import Collision from 'server/actions/Collision';
import InitializeMap from 'server/actions/InitializeMap';
import Ping from 'server/actions/Ping';
import Pong from 'server/actions/Pong';
import PlayerMove from 'server/actions/PlayerMove';
import SpawnPlayer from 'server/actions/SpawnPlayer';
import UpdatePlayers from 'server/actions/UpdatePlayers';
import UpdateSpells from 'server/actions/UpdateSpells';

export default {
  [OperationCode.ADD_PLAYER]: AddPlayer,
  [OperationCode.CAST_SPELL]: CastSpell,
  [OperationCode.COLLISION]: Collision,
  [OperationCode.INITIALIZE_MAP]: InitializeMap,
  [OperationCode.PING]: Ping,
  [OperationCode.PONG]: Pong,
  [OperationCode.PLAYER_MOVE]: PlayerMove,
  [OperationCode.SPAWN_PLAYER]: SpawnPlayer,
  [OperationCode.UPDATE_PLAYERS]: UpdatePlayers,
  [OperationCode.UPDATE_SPELLS]: UpdateSpells,
} as { [key in OperationCode]?: { new(socket: ws.WebSocket): Action} };
