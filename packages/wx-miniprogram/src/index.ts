import { InitOptions } from 'front-monitor-types';
import { isWxMiniEnv } from 'front-monitor-utils';
import { initOptions, log } from 'front-monitor-core';
import { SDK_NAME, SDK_VERSION } from 'front-monitor-shared';
import { setupReplace } from './load';
import { sendTrackData, track } from './initiative';

export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return;
  initOptions(options);
  setupReplace();
  Object.assign(wx, { monitorLog: log, SDK_NAME, SDK_VERSION });
}

export { log, sendTrackData, track };
