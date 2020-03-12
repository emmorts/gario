import Schema from 'common/Schema';
import { OperationCode } from 'common/OperationCode';

import { AddPlayerSchema } from 'common/schemas/AddPlayer';
import { CastSpellSchema } from 'common/schemas/CastSpell';
import { CollisionSchema } from 'common/schemas/Collision';
import { InitializeMapSchema } from 'common/schemas/InitializeMap';
import { PingSchema } from 'common/schemas/Ping';
import { PongSchema } from 'common/schemas/Pong';
import { PlayerMoveSchema } from 'common/schemas/PlayerMove';
import { SpawnPlayerSchema } from 'common/schemas/SpawnPlayer';
import { UpdatePlayersSchema } from 'common/schemas/UpdatePlayers';
import { UpdateSpellsSchema } from 'common/schemas/UpdateSpells';

const schemas: { [key in OperationCode]?: Schema } = {
  [OperationCode.ADD_PLAYER]: AddPlayerSchema,
  [OperationCode.CAST_SPELL]: CastSpellSchema,
  [OperationCode.COLLISION]: CollisionSchema,
  [OperationCode.INITIALIZE_MAP]: InitializeMapSchema,
  [OperationCode.PING]: PingSchema,
  [OperationCode.PONG]: PongSchema,
  [OperationCode.PLAYER_MOVE]: PlayerMoveSchema,
  [OperationCode.SPAWN_PLAYER]: SpawnPlayerSchema,
  [OperationCode.UPDATE_PLAYERS]: UpdatePlayersSchema,
  [OperationCode.UPDATE_SPELLS]: UpdateSpellsSchema,
};

export const get = function(opCode: OperationCode): Schema {
  if (opCode in schemas) {
    return schemas[opCode];
  }

  throw new Error(`Unable to find schema for '${OperationCode[opCode]}'.`);
}
