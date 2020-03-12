import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';
import Point from 'common/structures/Point';
import Color from 'common/structures/Color';

export interface TUpdatedSpell {
  id: string,
  ownerId: string,
  type: number,
  mas: number,
  power: number,
  foloweeId: string
  position: Point,
  targetPosition: Point,
  color: Color
}

export interface TUpdateSpellsSchema {
  updatedSpells: TUpdatedSpell[],
  destroyedSpells: string[]
}

export const UpdateSpellsSchema = new Schema<TUpdateSpellsSchema>(OperationCode.UPDATE_SPELLS, {
  updatedSpells: [{
    id: 'string',
    ownerId: 'string',
    type: 'uint8',
    mass: 'uint8',
    power: 'uint8',
    position: 'point',
    targetPosition: 'point',
    followeeId: 'string',
    color: 'color'
  }],
  destroyedSpells: ['string'],
});
