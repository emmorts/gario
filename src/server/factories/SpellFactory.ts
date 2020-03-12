import GenericModelFactory from 'server/factories/GenericFactory';
import Spells from 'server/spells';

class SpellFactory extends GenericModelFactory<typeof Spells> {
  constructor() {
    super(Spells);
  }
}

export default new SpellFactory();