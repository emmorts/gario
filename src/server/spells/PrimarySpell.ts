import { v4 as uuid } from 'uuid';
import Primary from 'common/gameobjects/spells/Primary';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import Point from 'common/structures/Point';

interface PrimarySpellConstructorOptions {
  position: Point,
  target: Point
}

export default class PrimarySpell extends Primary {
  id = uuid().replace(/-/g, '');
  type = SpellType.Primary;

  constructor(ownerId: string, options: PrimarySpellConstructorOptions) {
    super(ownerId);

    if (options.position) {
      this._position.x = options.position.x;
      this._position.y = options.position.y;
    }

    if (options.target) {
      this.setTarget(options.target);
    }
  }
}
