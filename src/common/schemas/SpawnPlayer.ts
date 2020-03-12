import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';

export interface TSpawnPlayerSchema {
  name: string
}

export const SpawnPlayerSchema = new Schema<TSpawnPlayerSchema, string>(OperationCode.SPAWN_PLAYER, {
  name: { type: 'string' },
}, ({ name }) => name || '');
