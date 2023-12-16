import { ErrorTypes, BreadCrumbTypes } from 'front-monitor-shared';
import {
  isError,
  extractErrorStack,
  getLocationHref,
  getTimestamp,
  unknownToString,
  isWxMiniEnv,
  Severity,
  getCurrentRoute,
} from 'front-monitor-utils';
import { transportData } from './transportData';
import { breadcrumb } from './breadcrumb';
import { TNumStrObj } from 'front-monitor-types';

interface LogTypes {
  message: TNumStrObj;
  tag?: TNumStrObj;
  level?: Severity;
  ex?: Error | any;
  type?: string;
}

// 自定义错误信息
export function log({
  message = 'emptyMsg',
  tag = '',
  level = Severity.Critical,
  ex = '',
  type = ErrorTypes.LOG_ERROR,
}: LogTypes): void {
  let errorInfo = {};
  if (isError(ex)) {
    // 解析 error 的 stack 并返回args、column、line、func、url
    errorInfo = extractErrorStack(ex, level);
  }
  const error = {
    type,
    level,
    message: unknownToString(message),
    name: 'Monitor.log',
    customTag: unknownToString(tag),
    time: getTimestamp(),
    url: isWxMiniEnv ? getCurrentRoute() : getLocationHref(),
    ...errorInfo,
  };

  // 自定义错误信息注入错误栈中
  breadcrumb.push({
    type: BreadCrumbTypes.CUSTOMER,
    category: breadcrumb.getCategory(BreadCrumbTypes.CUSTOMER),
    data: message,
    level: Severity.fromString(level.toString()),
  });

  transportData.send(error);
}
