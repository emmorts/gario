import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';

export interface TPlayerMoveSchema {
  x: number,
  y: number
}

export const PlayerMoveSchema = new Schema<TPlayerMoveSchema>(OperationCode.PLAYER_MOVE, {
  x: 'uint16',
  y: 'uint16',
});