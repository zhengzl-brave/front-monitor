export enum metricsName {
  /* performance metrics */
  NT = 'navigation-timing',
  FP = 'first-paint',
  FCP = 'first-contentful-paint',
  LCP = 'largest-contentful-paint', // 指标会报告视口内可见最大图片或内容呈现的时间
  CCP = 'custom-contentful-paint',
  FID = 'first-input-delay', // 用户首次与网页互动到浏览器实际能够开始处理事件以响应互动的时间
  RL = 'resource-flow',
  CLS = 'cumulative-layout-shift', // 页面整个生命周期内发生每次意外布局偏移的最大突发性布局偏移分数
  FPS = 'fps',
  ACT = 'api-complete-time',
  /* information */
  DI = 'device-information',
  NI = 'network-information',
  PI = 'page-information',
}
