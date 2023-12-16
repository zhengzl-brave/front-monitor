import { EventTypes, HttpCodes, HttpTypes, voidFun } from 'front-monitor-shared';
import {
  _global,
  getTimestamp,
  replaceOld,
  variableTypeDetection,
  on,
  isExistProperty,
  getLocationHref,
  supportsHistory,
  throttle,
} from 'front-monitor-utils';
import { EMethods, MonitorHttp, MonitorXMLHttpRequest } from 'front-monitor-types';
import {
  ReplaceHandler,
  options,
  setTraceId,
  subscribeEvent,
  transportData,
  triggerHandler,
} from 'front-monitor-core';

function isFilterHttpUrl(url: string) {
  return options.filterXhrUrlRegExp && options.filterXhrUrlRegExp.test(url);
}
function replace(type: EventTypes) {
  switch (type) {
    case EventTypes.XHR:
      xhrReplace();
      break;
    case EventTypes.FETCH:
      fetchReplace();
      break;
    case EventTypes.ERROR:
      listenError();
      break;
    case EventTypes.CONSOLE:
      consoleReplace();
      break;
    case EventTypes.HISTORY:
      historyReplace();
      break;
    case EventTypes.UNHANDLEDREJECTION:
      unhandledrejectionReplace();
      break;
    case EventTypes.DOM:
      domReplace();
      break;
    case EventTypes.HASHCHANGE:
      listenHashchange();
      break;
    default:
      break;
  }
}

function xhrReplace(): void {
  if (!('XMLHttpRequest' in _global)) return;

  const originalXhrProto = XMLHttpRequest.prototype;
  replaceOld(originalXhrProto, 'open', (originalOpen: voidFun): voidFun => {
    // args open 方法的参数 method url
    return function (this: MonitorXMLHttpRequest, ...args: any[]): void {
      this.monitor_xhr = {
        method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        sTime: getTimestamp(),
        type: HttpTypes.XHR,
      };
      originalOpen.apply(this, args);
    };
  });
  replaceOld(originalXhrProto, 'send', (originalSend: voidFun): voidFun => {
    return function (this: MonitorXMLHttpRequest, ...args: any[]): void {
      const { method, url } = this.monitor_xhr;
      setTraceId(url, (headerFieldName: string, traceId: string) => {
        this.monitor_xhr.traceId = traceId;
        this.setRequestHeader(headerFieldName, traceId);
      });
      options.beforeAppAjaxSend && options.beforeAppAjaxSend({ method, url }, this);
      on(this, 'loadend', function (this: MonitorXMLHttpRequest) {
        if (
          (method === EMethods.Post && transportData.isSdkTransportUrl(url)) ||
          isFilterHttpUrl(url)
        ) {
          return;
        }
        const { responseType, response, status } = this;
        this.monitor_xhr.reqData = args[0];
        const eTime = getTimestamp();
        this.monitor_xhr.time = this.monitor_xhr.sTime;
        this.monitor_xhr.status = status;
        if (['', 'json', 'text'].indexOf(responseType) !== -1) {
          this.monitor_xhr.responseText =
            typeof response === 'object' ? JSON.stringify(response) : response;
        }
        this.monitor_xhr.elapsedTime = eTime - this.monitor_xhr.sTime;
        // 核心是去执行订阅的方法，传递参数
        triggerHandler(EventTypes.XHR, this.monitor_xhr);
      });
      originalSend.apply(this, args);
    };
  });
}

function fetchReplace(): void {
  if (!('fetch' in _global)) return;
  replaceOld(_global, EventTypes.FETCH, (originFetch: voidFun) => {
    return function (url: string, config: Partial<Request> = {}): void {
      const sTime = getTimestamp();
      const method = (config && config.method) || 'GET';
      let handlerData: MonitorHttp = {
        type: HttpTypes.FETCH,
        method,
        reqData: config && config.body,
        url,
      };
      const headers = new Headers(config.headers || {});
      Object.assign(headers, {
        setRequestHeader: headers.set,
      });
      setTraceId(url, (headerFieldName: string, traceId: string) => {
        handlerData.traceId = traceId;
        headers.set(headerFieldName, traceId);
      });
      options.beforeAppAjaxSend && options.beforeAppAjaxSend({ method, url }, headers);
      config = {
        ...config,
        headers,
      };
      return originFetch.apply(_global, [url, config]).then(
        (res: Response) => {
          const tempRes = res.clone();
          const eTime = getTimestamp();
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: tempRes.status,
            time: sTime,
          };
          tempRes.text().then((data) => {
            if (method === EMethods.Post && transportData.isSdkTransportUrl(url)) return;
            if (isFilterHttpUrl(url)) return;
            handlerData.responseText = tempRes.status > HttpCodes.UNAUTHORIZED && data;
            triggerHandler(EventTypes.FETCH, handlerData);
          });
          return res;
        },
        (err: Error) => {
          const eTime = getTimestamp();
          if (method === EMethods.Post && transportData.isSdkTransportUrl(url)) return;
          if (isFilterHttpUrl(url)) return;
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: 0,
            time: sTime,
          };
          triggerHandler(EventTypes.FETCH, handlerData);
          throw err;
        },
      );
    };
  });
}

function listenHashchange(): void {
  // isExistProperty 相当于 obj.hasOwnProperty
  if (!isExistProperty(_global, 'onpopstate')) {
    on(_global, EventTypes.HASHCHANGE, function (e: HashChangeEvent) {
      triggerHandler(EventTypes.HASHCHANGE, e);
    });
  }
}

function listenError(): void {
  on(
    _global,
    'error',
    function (e: ErrorEvent) {
      triggerHandler(EventTypes.ERROR, e);
    },
    true,
  );
}

function consoleReplace(): void {
  if (!('console' in _global)) return;
  const logType = ['log', 'debug', 'info', 'warn', 'error', 'assert'];
  logType.forEach(function (level: string): void {
    if (!(level in _global.console)) return;
    replaceOld(_global.console, level, function (originalConsole: () => any): Function {
      return function (...args: any[]): void {
        if (originalConsole) {
          triggerHandler(EventTypes.CONSOLE, { args, level });
          originalConsole.apply(_global.console, args);
        }
      };
    });
  });
}

// last time route
let lastHref: string;
lastHref = getLocationHref();
function historyReplace(): void {
  if (!supportsHistory()) return;
  const oldOnpopstate = _global.onpopstate;
  _global.onpopstate = function (this: WindowEventHandlers, ...args: any[]): any {
    const to = getLocationHref();
    const from = lastHref;
    lastHref = to;
    triggerHandler(EventTypes.HISTORY, {
      from,
      to,
    });
    oldOnpopstate && oldOnpopstate.apply(this, args);
  };
  function historyReplaceFn(originalHistoryFn: voidFun): voidFun {
    return function (this: History, ...args: any[]): void {
      const url = args.length > 2 ? args[2] : undefined;
      if (url) {
        const from = lastHref;
        const to = String(url);
        lastHref = to;
        triggerHandler(EventTypes.HISTORY, {
          from,
          to,
        });
      }
      return originalHistoryFn.apply(this, args);
    };
  }
  replaceOld(_global.history, 'pushState', historyReplaceFn);
  replaceOld(_global.history, 'replaceState', historyReplaceFn);
}

function unhandledrejectionReplace(): void {
  on(_global, EventTypes.UNHANDLEDREJECTION, function (ev: PromiseRejectionEvent) {
    // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
    triggerHandler(EventTypes.UNHANDLEDREJECTION, ev);
  });
}

function domReplace(): void {
  if (!('document' in _global)) return;
  const clickThrottle = throttle(triggerHandler, options.throttleDelayTime);
  on(
    _global.document,
    'click',
    function () {
      clickThrottle(EventTypes.DOM, {
        category: 'click',
        data: this,
      });
    },
    true,
  );
}

export function addReplaceHandler(handler: ReplaceHandler) {
  if (!subscribeEvent(handler)) return;
  replace(handler.type as EventTypes);
}
