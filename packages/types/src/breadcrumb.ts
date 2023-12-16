import { Severity } from 'front-monitor-utils';
import { BreadCrumbTypes } from 'front-monitor-shared';
import { Replace } from './replace';
import { TNumStrObj } from './common';
import { ReportDataType } from './transportData';

export interface BreadcrumbPushData {
  // 事件类型
  type: BreadCrumbTypes;
  data: ReportDataType | Replace.IRouter | Replace.TriggerConsole | TNumStrObj;
  category?: string;
  time?: number;
  level: Severity;
}
