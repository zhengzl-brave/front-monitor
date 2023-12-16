import { setUrlQuery, variableTypeDetection } from 'front-monitor-utils';
import { DeviceInfo } from 'front-monitor-types';

/**
 * 页面后退时需要计算当前页面的地址
 * @param delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页
 * @returns
 */
export function getNavigateBackTargetUrl(delta: number | undefined) {
  if (!variableTypeDetection.isFunction(getCurrentPages)) {
    return '';
  }
  // 在App里调用该方法，页面还没有生成，长度为0
  const pages = getCurrentPages();
  if (!pages.length) {
    return 'App';
  }
  delta = delta || 1;
  const toPage = pages[pages.length - delta];
  return setUrlQuery(toPage.route, toPage.options);
}

// 返回包含 id、data 字符串的标签
export function targetAsString(e: WechatMiniprogram.BaseEvent): string {
  const id = e.currentTarget?.id ? `id="${e.currentTarget?.id}"` : '';
  const dataSets = Object.keys(e.currentTarget.dataset).map((key) => {
    return `data-${key}="${e.currentTarget.dataset[key]}"`;
  });
  return `<element ${id} ${dataSets.join(' ')} />`;
}

export async function getWxMiniDeviceInfo(): Promise<DeviceInfo> {
  const { pixelRatio, screenHeight, screenWidth } = wx.getSystemInfoSync();
  const netType = await getWxMiniNetWorkType();
  return {
    ratio: pixelRatio,
    clientHeight: screenHeight,
    clientWidth: screenWidth,
    netType,
  };
}

export async function getWxMiniNetWorkType(): Promise<string> {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success(res) {
        resolve(res.networkType);
      },
      fail(err) {
        console.error(`获取微信小程序网络类型失败:${err}`);
        resolve('getNetWrokType failed');
      },
    });
  });
}
