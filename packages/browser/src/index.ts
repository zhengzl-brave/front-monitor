import { InitOptions } from 'front-monitor-types';
import { _global } from 'front-monitor-utils';
import { initOptions, log } from 'front-monitor-core';
import { SDK_NAME, SDK_VERSION } from 'front-monitor-shared';
import { setupReplace } from './load';

export * from './handleEvents';
export * from './load';
export * from './replace';

function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return;
  initOptions(options);
  setupReplace();
}
function init(options: InitOptions = {}): void {
  webInit(options);
}

export { SDK_NAME, SDK_VERSION, init, log };
