// Performance monitoring entry

import 'core-js/es/array/includes';
import 'core-js/es/object/values';
import createReporter from './lib/createReporter';
import { clearMark, getMark, hasMark, setMark } from './lib/markHandler';
import { measure } from './lib/measureCustomMetrics';
import { onHidden } from './lib/onHidden';
import MetricsStore from './lib/store';
import { initCCP } from './metrics/getCCP';
import { initCLS } from './metrics/getCLS';
import { initDeviceInfo } from './metrics/getDeviceInfo';
import { initFCP } from './metrics/getFCP';
import { initFP } from './metrics/getFP';
import { initLCP } from './metrics/getLCP';
import { initNavigationTiming } from './metrics/getNavigationTiming';
import { initNetworkInfo } from './metrics/getNetworkInfo';
import { initPageInfo } from './metrics/getPageInfo';
import { initFID } from './metrics/gtFID';
import { IConfig, IMetricsObj, IWebVitals } from './types';
import { afterLoad, beforeUnload, unload } from './utils';
import generateUniqueID from './utils/generateUniqueID';

let metricsStore: MetricsStore;
let reporter: ReturnType<typeof createReporter>;

class WebVitals implements IWebVitals {
  immediately: boolean;

  constructor(config: IConfig) {
    const {
      appId,
      version,
      reportCallback,
      immediately = false,
      isCustomEvent = false,
      logFpsCount = 5,
      apiConfig = {},
      hashHistory = true,
      excludeRemotePath = [],
      maxWaitCCPDuration = 30 * 1000,
      scoreConfig = {},
    } = config;

    this.immediately = immediately;

    const sessionId = generateUniqueID();
    window.__monitor_sessionId__ = sessionId;
    reporter = createReporter(sessionId, appId, version, reportCallback);
    metricsStore = new MetricsStore();

    // PI: 页面信息，包括页面 URL、标题等
    initPageInfo(metricsStore, reporter, immediately);
    // NI: 网络信息，包括网络类型、速度等
    initNetworkInfo(metricsStore, reporter, immediately);
    // DI: 设备信息，包括设备类型、分辨率等
    initDeviceInfo(metricsStore, reporter, immediately);
    // CLS: 累积布局位移，用于衡量页面加载过程中元素位置变化的情况
    initCLS(metricsStore, reporter, immediately, scoreConfig);
    // LCP: 页面最大内容渲染时间，即页面中最大的可见元素被渲染的时间点
    initLCP(metricsStore, reporter, immediately, scoreConfig);
    // CCP: 自定义内容渲染时间，通常是指开发者自定义的重要内容渲染时间点
    initCCP(
      metricsStore,
      reporter,
      isCustomEvent,
      apiConfig,
      hashHistory,
      excludeRemotePath,
      maxWaitCCPDuration,
      immediately,
      scoreConfig,
    );

    addEventListener(
      isCustomEvent ? 'custom-contentful-paint' : 'pageshow',
      () => {
        // FP: 首次渲染时间，即浏览器首次将像素渲染到屏幕上的时间点
        initFP(metricsStore, reporter, immediately, scoreConfig);
        // FCP:  首个内容渲染时间，即首个 DOM 内容被渲染的时间点
        initFCP(metricsStore, reporter, immediately, scoreConfig);
      },
      { once: true, capture: true },
    );

    afterLoad(() => {
      // NT: 用于测量页面加载的各个阶段的时间
      initNavigationTiming(metricsStore, reporter, immediately);
      // FID: 用户首次交互延迟，即用户首次与页面交互到页面响应的时间
      initFID(metricsStore, reporter, immediately, scoreConfig);
    });

    // if immediately is false,report metrics when visibility and unload

    [beforeUnload, unload, onHidden].forEach((fn) => {
      fn(() => {
        const metrics = this.getCurrentMetrics();
        if (Object.keys(metrics).length > 0 && !immediately) {
          reporter(metrics);
        }
      });
    });
  }

  getCurrentMetrics(): IMetricsObj {
    return metricsStore.getValues();
  }

  private static dispatchCustomEvent(): void {
    const event = document.createEvent('Events');
    event.initEvent('custom-contentful-paint', false, true);
    document.dispatchEvent(event);
  }

  setStartMark(markName: string): void {
    setMark(`${markName}_start`);
  }

  setEndMark(markName: string): void {
    setMark(`${markName}_end`);
    if (hasMark(`${markName}_start`)) {
      const value = measure(`${markName}Metrics`, markName);
      this.clearMark(markName);
      const metrics = { name: `${markName}Metrics`, value };
      metricsStore.set(`${markName}Metrics`, metrics);
      if (this.immediately) {
        reporter(metrics);
      }
    } else {
      const value = getMark(`${markName}_end`)?.startTime;
      this.clearMark(markName);
      const metrics = { name: `${markName}Metrics`, value };
      metricsStore.set(`${markName}Metrics`, metrics);
      if (this.immediately) {
        reporter(metrics);
      }
    }
  }

  clearMark(markName: string): void {
    clearMark(`${markName}_start`);
    clearMark(`${markName}_end`);
  }

  customContentfulPaint() {
    setTimeout(() => {
      WebVitals.dispatchCustomEvent();
    });
  }
}

export { WebVitals };
