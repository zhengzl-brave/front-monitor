import { BreadcrumbPushData } from './breadcrumb';
import { TransportDataType } from './transportData';
import { Breadcrumb } from 'front-monitor-core';
type CANCEL = null | undefined | boolean;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';

export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

interface IRequestHeaderConfig {
  url: HttpMethod;
  method: string;
}

type TSetRequestHeader = (key: string, value: string) => {};

export interface IBeforeAppAjaxSendConfig {
  setRequestHeader: TSetRequestHeader;
}

export interface HooksTypes {
  /**
   * 钩子函数，配置发送到服务端的xhr
   * 可以对当前xhr实例做一些配置：xhr.setRequestHeader()、xhr.withCredentials
   * 会在xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')、
   * xhr.withCredentials = true,后面调用该函数
   * ../param xhr XMLHttpRequest的实例
   */
  configReportXhr?(xhr: XMLHttpRequest, reportData: TransportDataType | any): void;
  /**
   * 钩子函数，在每次发送事件前会调用
   *
   * ../param event 有SDK生成的错误事件
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次上传
   */
  beforeDataReport?(
    event: TransportDataType,
  ): Promise<TransportDataType | null | CANCEL> | TransportDataType | any | CANCEL | null;
  /**
   *
   * 钩子函数，每次发送前都会调用
   * @param {TransportDataType} event 上报的数据格式
   * @param {string} url 上报到服务端的地址
   * @returns {string} 返回空时不上报
   * @memberof HooksTypes
   */
  configReportUrl?(event: TransportDataType, url: string): string;
  /**
   * 钩子函数，在每次添加用户行为事件前都会调用
   *
   * ../param breadcrumb 由SDK生成的breacrumb事件栈
   * ../param hint 当次的生成的breadcrumb数据
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次的push
   */
  beforePushBreadcrumb?(
    breadcrumb: Breadcrumb, // breakcrumb
    hint: BreadcrumbPushData,
  ): BreadcrumbPushData | CANCEL;
  /**
   * 在状态小于400并且不等于0的时候回调用当前hook
   * ../param data 请求状态为200时返回的响应体
   * ../returns 如果返回 null | undefined | boolean 时，将忽略本次的上传
   */
  // afterSuccessHttp?<T>(data: T): string | CANCEL
  /**
   * 钩子函数，拦截用户页面的ajax请求，并在ajax请求发送前执行该hook，可以对用户发送的ajax请求做xhr.setRequestHeader
   * ../param config 当前请求的
   */
  beforeAppAjaxSend?(
    config: IRequestHeaderConfig,
    setRequestHeader: IBeforeAppAjaxSendConfig,
  ): void;

  /**
   * 钩子函数，在beforeDataReport后面调用，在整合上报数据和本身SDK信息数据前调用，当前函数执行完后立即将数据错误信息上报至服务端
   * trackerId表示用户唯一键（可以理解成userId），需要trackerId的意义可以区分每个错误影响的用户数量
   */
  backTrackerId?(): string | number;
}

export interface SilentEventTypes {
  // 静默监控 xhr 事件
  silentXhr?: boolean;
  // 静默监控 fetch 事件
  silentFetch?: boolean;
  // 静默监控 console 事件
  silentConsole?: boolean;
  // 静默监控 dom 事件
  silentDom?: boolean;
  // 静默监控 history 事件
  silentHistory?: boolean;
  // 静默监控 error 事件
  silentError?: boolean;
  // 静默监控 unhandledrejection 事件
  silentUnhandledrejection?: boolean;
  // 静默监控 hashchange 事件
  silentHashchange?: boolean;
  // 静默监控 vue.warn 函数
  silentVue?: boolean;
}

export interface WxSilentEventTypes {
  // 静默监控AppOnError
  silentWxOnError?: boolean;
  // 静默监控AppOnUnhandledRejection
  silentWxOnUnhandledRejection?: boolean;
  // 静默监控AppOnPageNotFound
  silentWxOnPageNotFound?: boolean;
  // 静默监控PageOnShareAppMessage
  silentWxOnShareAppMessage?: boolean;
  // 静默监控小程序路由
  silentMiniRoute?: boolean;
}

export type IWxPageInstance = WechatMiniprogram.Page.Instance<
  WechatMiniprogram.IAnyObject,
  WechatMiniprogram.IAnyObject
>;

interface WxMiniHooksTypes {
  // wx小程序上报时的wx.request配置
  configReportWxRequest?(event: TransportDataType | any): Partial<WechatMiniprogram.RequestOption>;
  // wx小程序的App下的onLaunch执行完后再执行以下hook
  appOnLaunch?(options: WechatMiniprogram.App.LaunchShowOption): void;
  // wx小程序的App下的OnShow执行完后再执行以下hook
  appOnShow?(options: WechatMiniprogram.App.LaunchShowOption): void;
  // wx小程序的App下的OnHide执行完后再执行以下hook
  appOnHide?(page: IWxPageInstance): void;
  // wx小程序的App下的onPageNotFound执行完后再执行以下hook
  onPageNotFound?(data: WechatMiniprogram.OnPageNotFoundCallbackResult): void;
  // 先执行hook:pageOnShow再执行wx小程序的Page下的onShow
  pageOnShow?(page: IWxPageInstance): void;
  // wx小程序的App下的pageOnUnload执行完后再执行以下hook
  pageOnUnload?(page: IWxPageInstance): void;
  // 先执行hook:pageOnHide再执行wx小程序的Page下的onHide
  pageOnHide?(page: IWxPageInstance): void;
  // 先执行hook:onShareAppMessage再执行wx小程序的Page下的onShareAppMessage
  onShareAppMessage?(
    options: WechatMiniprogram.Page.IShareAppMessageOption & IWxPageInstance,
  ): void;
  // 先执行hook:onShareTimeline再执行wx小程序的Page下的onShareTimeline
  onShareTimeline?(page: IWxPageInstance): void;
  // 先执行hook:onTabItemTap再执行wx小程序的Page下的onTabItemTap
  onTabItemTap?(options: WechatMiniprogram.Page.ITabItemTapOption & IWxPageInstance): void;
  // 重写wx.NavigateToMiniProgram将里面的参数抛出来，便于在跳转时更改query和extraData
  wxNavigateToMiniProgram?(
    options: WechatMiniprogram.NavigateToMiniProgramOption,
  ): WechatMiniprogram.NavigateToMiniProgramOption;
  // 代理Action中所有函数，拿到第一个参数并抛出成hook
  triggerWxEvent?(e: WechatMiniprogram.BaseEvent): void;
}

export interface BrowserHooksTypes {
  onRouteChange?: (from: string, to: string) => unknown;
}

export interface InitOptions
  extends HooksTypes,
    SilentEventTypes,
    WxSilentEventTypes,
    WxMiniHooksTypes,
    BrowserHooksTypes {
  // 错误监控的 dsn 服务器地址
  dsn?: string;
  // 为true时，将整个sdk禁用
  disabled?: boolean;
  // 每个项目有唯一一个key，给监控的dsn用的
  apikey?: string;
  // 使用 img 上报的方式，默认为 false，默认是 xhr 的上报方式
  useImgUpload?: boolean;
  // 每个项目有一个唯一的 trackKey，给埋点的 dsn 用的
  trackKey?: string;
  // 默认为关闭，为 true 时会打印一些信息：breadcrumb
  debug?: boolean;
  // 默认是关闭 traceId,开启时候，页面所有的请求都会产生一个uuid，放入请求头中
  enableTraceId?: boolean;
  // 如果开启了 enableTraceId，也需要配置下面这一项，includeHttpUrlTraceIdRegExp.test(xhr.url)为true时
  // 才会在该请求头中添加traceId；由于考虑部分接口随便加上多余的请求头会造成跨域，所以这边用的是包含关系的正则。
  includeHttpUrlTraceIdRegExp?: RegExp;
  // traceId 放入请求头中的 key，默认是 Trace-Id
  traceIdFieldName?: string;
  // 默认为空，所有的Ajax都会被监听，不为空时，filterXhrUrlRegExp.test(xhr.url)为true时过滤
  filterXhrUrlRegExp?: RegExp;
  // 默认是20，最大是100，超过100还是设置为100
  maxBreadcrumbs?: number;
  // 按钮点击和微信触摸事件节流时间，默认是0
  throttleDelayTime?: number;
  // 在引入 wx-mini 的情况下，使用该参数用来开启
  enableTrack?: boolean;
  // 在开启 enableBury后，将所有埋点信息上报到该服务端地址，如果该属性有值时才会启动无痕埋点
  trackDsn?: string;
  // 最多可重复上报同一个错误的次数
  maxDuplicateCount?: number;
}
