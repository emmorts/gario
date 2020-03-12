import PointStrategy from 'common/strategies/PointStrategy';
import ColorStrategy from 'common/strategies/ColorStrategy';
import { StrategyBase } from 'buffercodec/dist';

export default [
  PointStrategy,
  ColorStrategy
] as { new(): StrategyBase }[];