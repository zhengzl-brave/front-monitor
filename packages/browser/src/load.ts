import { addReplaceHandler } from './replace';
import { HandleEvents } from './handleEvents';
import { BreadCrumbTypes, EventTypes } from 'front-monitor-shared';
import { breadcrumb, handleConsole } from 'front-monitor-core';
import { Severity, htmlElementAsString } from 'front-monitor-utils';
export function setupReplace(): void {
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BreadCrumbTypes.XHR);
    },
    type: EventTypes.XHR,
  });

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BreadCrumbTypes.FETCH);
    },
    type: EventTypes.FETCH,
  });

  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error);
    },
    type: EventTypes.ERROR,
  });

  addReplaceHandler({
    callback: (data) => {
      handleConsole(data);
    },
    type: EventTypes.CONSOLE,
  });

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHistory(data);
    },
    type: EventTypes.HISTORY,
  });

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleUnhandleRejection(data);
    },
    type: EventTypes.UNHANDLEDREJECTION,
  });

  addReplaceHandler({
    callback: (data) => {
      const htmlString = htmlElementAsString(data.data.activeElement as HTMLElement);
      if (htmlString) {
        breadcrumb.push({
          type: BreadCrumbTypes.CLICK,
          category: breadcrumb.getCategory(BreadCrumbTypes.CLICK),
          data: htmlString,
          level: Severity.Info,
        });
      }
    },
    type: EventTypes.DOM,
  });

  addReplaceHandler({
    callback: (e: HashChangeEvent) => {
      HandleEvents.handleHashcange(e);
    },
    type: EventTypes.HASHCHANGE,
  });
}
