import { v4 as uuidv4 } from 'uuid';
import PlayerBase from 'common/gameobjects/models/Player';

export default class Player extends PlayerBase {
  id: string = uuidv4().replace(/-/g, '');
}
