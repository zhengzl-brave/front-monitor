import { Severity, getFlag, setFlag, slientConsoleScope } from 'front-monitor-utils';
import { EventTypes } from 'front-monitor-shared';
import { ViewModel, VueInstance } from './types';
import { handleVueError } from './helper';

const hasConsole = typeof console !== 'undefined';

const MonitorVue = {
  // 通过vue插件化机制进行拦截处理
  install(Vue: VueInstance): void {
    if (getFlag(EventTypes.VUE) || !Vue || !Vue.config) return;
    setFlag(EventTypes.VUE, true);
    Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
      handleVueError.apply(null, [err, vm, info, Severity.Normal, Severity.Error, Vue]);
      if (hasConsole && !Vue.config.silent) {
        // silentConsoleScope 静默处理 回调不加入 breadcrumb
        slientConsoleScope(() => {
          console.error('Error in ' + info + ': "' + err.toString() + '"', vm);
          console.error(err);
        });
      }
    };
  },
};

export { MonitorVue };
