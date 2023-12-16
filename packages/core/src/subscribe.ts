import { EventTypes, WxEvents } from 'front-monitor-shared';
import { getFlag, getFunctionName, logger, nativeTryCatch, setFlag } from 'front-monitor-utils';

type ReplaceCallback = (data: any) => void;

export interface ReplaceHandler {
  type: EventTypes | WxEvents;
  callback: ReplaceCallback;
}

const handlers: { [key in EventTypes]?: ReplaceCallback[] } = {};

// 事件的订阅
export function subscribeEvent(handler: ReplaceHandler): boolean {
  // 防止重复订阅同样类型的事件就有了 getFlag 判断
  if (!handler || getFlag(handler.type)) return false;
  setFlag(handler.type, true);
  handlers[handler.type] = handlers[handler.type] || [];
  handlers[handler.type].push(handler.callback);
  return true;
}

// 事件的发布
export function triggerHandler(type: EventTypes | WxEvents, data: any) {
  if (!type || !handlers[type]) return;
  handlers[type].forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data);
      },
      (e: Error) => {
        logger.error(
          `重写事件triggerHandlers的回调函数发生错误\nType:${type}\nName: ${getFunctionName(
            callback,
          )}\nError: ${e}`,
        );
      },
    );
  });
}
