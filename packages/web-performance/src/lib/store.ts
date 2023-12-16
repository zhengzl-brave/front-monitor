import { metricsName } from '../constants';
import { IMetrics, IMetricsObj } from '../types';

// store metrics

class metricsStore {
  state: Map<metricsName | string, IMetrics>;
  constructor() {
    this.state = new Map<metricsName | string, IMetrics>();
  }

  set(key: metricsName | string, value: IMetrics) {
    this.state.set(key, value);
  }

  get(key: metricsName | string): IMetrics {
    return this.state.get(key);
  }

  has(key: metricsName | string): boolean {
    return this.state.has(key);
  }

  clear() {
    this.state.clear();
  }

  getValues(): IMetricsObj {
    return Array.from(this.state).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  }
}

export default metricsStore;
