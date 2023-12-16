import { PerformanceEntryHandler } from '../types';

// 创建用于监听条目并将其记录到控制台的PerformanceObserver。
// 对应类型的条目在 constants 中， 如 LCP = 'largest-contentful-paint'
const observe = (
  type: string,
  callback: PerformanceEntryHandler,
): PerformanceObserver | undefined => {
  try {
    if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
      const po: PerformanceObserver = new PerformanceObserver((l) => l.getEntries().map(callback));
      po.observe({ type, buffered: true });
      return po;
    }
  } catch (error) {
    throw error;
  }
};

export default observe;
