import { isPerformanceSupported } from '../utils/isSupported';

export const measure = (customMetrics: string, markName): PerformanceEntry | undefined => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance');
    return;
  }

  // measure() 方法在浏览器性能记录缓存中创建了一个名为时间戳的记录来记录两个特殊标志位（通常称为开始标志和结束标志）。被命名的时间戳称为一次测量（measure）。
  // measure(被测量名称， 开始标志， 结束标志)
  performance.measure(customMetrics, `${markName}_start`, `${markName}_end`);

  // 通过 getEntriesByName() 方法获取测量的输出
  return performance.getEntriesByName(customMetrics).pop();
};
