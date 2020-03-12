import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';
import Point from 'common/structures/Point';
import { SpellType } from 'common/gameobjects/spells/SpellType';

export interface TCastSpellSchema {
  type: SpellType,
  playerPosition: Point,
  target: Point,
}

export const CastSpellSchema = new Schema<TCastSpellSchema>(OperationCode.CAST_SPELL, {
  type: 'uint8',
  playerPosition: 'point',
  target: 'point'
});
