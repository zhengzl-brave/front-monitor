import { resolve } from 'path';

export const port = 2021;
const resolveDirname = (target: string) => resolve(__dirname, target);
const JsFilePath = resolveDirname('../JS');
const VueFilePath = resolveDirname('../Vue');
const ReactFilePath = resolveDirname('../React');
const Vue3FilePath = resolveDirname('../Vue3');
const webFilePath = resolve('./packages/web/dist');
const browserFilePath = resolve('./packages/browser/dist');
const webPerfFilePath = resolve('./packages/web-performance/dist');
const WebPerformancePath = resolveDirname('../WebPerformance');

export const FilePaths = {
  '/JS': JsFilePath,
  '/browserDist': browserFilePath,
  '/Vue': VueFilePath,
  '/React': ReactFilePath,
  '/Vue3': Vue3FilePath,
  '/webDist': webFilePath,
  '/wpDist': webPerfFilePath,
  '/WebPerformance': WebPerformancePath,
};

export const ServerUrls = {
  normalGet: '/normal',
  exceptionGet: '/exception',
  normalPost: '/normal/post',
  exceptionPost: '/exception/post',
  errorsUpload: '/errors/upload',
};
