import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';
import Point from 'common/structures/Point';
import Color from 'common/structures/Color';

export interface TAddPlayerSchema {
  id: string,
  ownerId: string,
  name: string,
  health: string,
  maxHealth: string,
  position: Point,
  color: Color,
}

export const AddPlayerSchema = new Schema<TAddPlayerSchema>(OperationCode.ADD_PLAYER, {
  id: 'string',
  ownerId: 'string',
  name: 'string',
  health: 'uint16',
  maxHealth: 'uint16',
  position: 'point',
  color: 'color'
});
