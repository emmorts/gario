import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';

export interface TInitializeMapSchema {
  width: number,
  height: number,
  tileSize: number,
  mapRows: number[][]
}

export const InitializeMapSchema = new Schema<TInitializeMapSchema>(OperationCode.INITIALIZE_MAP, {
  width: 'uint8',
  height: 'uint8',
  tileSize: 'uint8',
  tiledMap: [['uint8']],
});
