import FFA from 'server/gamemodes/FFA';
import { GameModeType } from 'server/gamemodes/GameModeType';
import GameMode from 'server/gamemodes/GameMode';

// const a = [
//   FFA
// ].reduce((collection: { [key in GameModeType]?: { new(name: string): Mode} }, mode: Mode) => {
//   collection[mode.type] = mode;

//   return mode;
// }, {});
export default {
  [GameModeType.FFA]: FFA
} as { [key in GameModeType]?: new() => GameMode }