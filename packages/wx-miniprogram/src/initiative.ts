import { ITrackBaseParam, TrackReportData, EActionType } from 'front-monitor-types';
import { transportData } from 'front-monitor-core';
import { generateUUID, getTimestamp } from 'front-monitor-utils';

export function track(actionType: EActionType, param: ITrackBaseParam) {
  const data = {
    ...param,
    actionType,
  };
  sendTrackData(data);
  return data;
}

// 手动发送埋点数据到服务端，埋点上报的数据，必须含有actionType属性
export function sendTrackData(data: TrackReportData) {
  const id = generateUUID();
  const trackTime = getTimestamp();
  transportData.send({
    id,
    trackTime,
    ...data,
  });
}
