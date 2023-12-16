import { BreadCrumbTypes, ErrorTypes } from 'front-monitor-shared';
import { Severity, extractErrorStack, isError } from 'front-monitor-utils';
import { ReportDataType } from 'front-monitor-types';
import { breadcrumb, transportData } from 'front-monitor-core';

// 收集 react ErrorBoundary 中的错误对象，需用用户手动在 componentDidCatch 中设置
export function errorBoundaryReport(ex: any): void {
  if (!isError(ex)) {
    console.warn('传入的react error不是一个object Error');
    return;
  }
  // extractErrorStack 解析 error 的 stack,返回 normal 对象数据及 stack
  const error = extractErrorStack(ex, Severity.Normal) as ReportDataType;
  error.type = ErrorTypes.REACT_ERROR;
  breadcrumb.push({
    type: BreadCrumbTypes.REACT,
    category: breadcrumb.getCategory(BreadCrumbTypes.REACT),
    data: `${error.name}: ${error.message}`,
    level: Severity.fromString(error.level),
  });
  transportData.send(error);
}
