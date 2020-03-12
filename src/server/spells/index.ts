import PrimarySpell from 'server/spells/PrimarySpell';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import HomingSpell from './HomingSpell';

export default {
  [SpellType.Primary]: PrimarySpell,
  [SpellType.Homing]: HomingSpell
};