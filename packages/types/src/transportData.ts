import { BreadcrumbPushData } from './breadcrumb';
import { DeviceInfo, EActionType } from './track';

export interface AuthInfo {
  apikey?: string;
  trackKey?: string;
  sdkVersion: string;
  sdkName: string;
  trackerId: string;
}

interface ICommonDataType {
  isTrackData?: boolean;
}

export interface ReportDataType extends ICommonDataType {
  type?: string;
  message?: string;
  url: string;
  name?: string;
  stack?: any;
  time?: number;
  errorId?: number;
  level: string;

  // ajax
  elapsedTime?: number;
  request?: {
    httpType?: string;
    traceId?: string;
    method: string;
    url: string;
    data: any;
  };
  response?: {
    status: number;
    data: string;
  };
  // vue
  componentName?: string;
  propsData?: any;
  customTag?: string;
}

export interface TrackReportData extends ICommonDataType {
  id?: string; // uuid
  trackId?: string; // 埋点 code 一般由人为传进来，可以自定义规范
  actionType: EActionType; // 埋点类型
  startTime?: number; // 埋点开始时间
  durationTime?: number; // 埋点停留时间
  trackTime?: number; // 上报时间
}

export type FinalReportType = ReportDataType | TrackReportData;

export interface TransportDataType {
  authInfo: AuthInfo;
  breadcrumb?: BreadcrumbPushData[];
  data?: FinalReportType;
  record?: any[];
  deviceInfo?: DeviceInfo;
}

export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (<TrackReportData>data).actionType === undefined && !data.isTrackData;
}
