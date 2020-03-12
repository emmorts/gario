import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';
import Point from 'common/structures/Point';
import Color from 'common/structures/Color';

export interface TUpdatedPlayer {
  id: string,
  ownerId: string,
  name: string,
  health: number,
  maxHealth: number,
  position: Point,
  targetPosition: Point,
  color: Color
}

export interface TUpdatePlayersSchema {
  updatedPlayers: TUpdatedPlayer[],
  destroyedPlayers: string[]
}

export const UpdatePlayersSchema = new Schema<TUpdatePlayersSchema>(OperationCode.UPDATE_PLAYERS, {
  updatedPlayers: [{
    id: 'string',
    ownerId: 'string',
    name: 'string',
    health: 'uint16',
    maxHealth: 'uint16',
    position: 'point',
    targetPosition: 'point',
    color: 'color'
  }],
  destroyedPlayers: ['string'],
});
