import GenericModelFactory from './GenericFactory';
import Models from 'server/models';

class ModelFactory extends GenericModelFactory<typeof Models> {
  constructor() {
    super(Models);
  }
}

export default new ModelFactory();