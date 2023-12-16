import { voidFun } from 'front-monitor-shared';

export function nativeTryCatch(fn: voidFun, errorFn?: (err: any) => void): void {
  try {
    fn();
  } catch (error) {
    console.log('err', error);
    errorFn(error);
  }
}
