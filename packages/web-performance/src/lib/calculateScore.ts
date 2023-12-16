import { IScoreConfig } from '../types';
import scoreDefaultConfig from '../config/scoreDefaultConfig';
import { QUANTILE_AT_VALUE } from '../utils/math';

// calcScore 用来计算指标得分
/**
 * @param metricsName string
 * @param value number
 * @param config IScoreConfig
 * @return the metrics score
 **/
const calcScore = (
  metricsName: string,
  value: number,
  config: IScoreConfig = {},
): number | null => {
  const mergeConfig = { ...scoreDefaultConfig, ...config };
  const metricsConfig = mergeConfig[metricsName];

  if (metricsConfig) {
    return QUANTILE_AT_VALUE(metricsConfig, value);
  }
  return null;
};

export default calcScore;
