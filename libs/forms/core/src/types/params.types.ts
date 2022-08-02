import { DynBaseHandler } from './provider.types';

/**
 * control params
 */
export interface DynControlParams {
  // once merged with the paramFns they can have any type
  [key: string]: any;
}

/**
 * control functions
 * ie. { paramFns: { getValue: 'getOptionText' }}
 */
 export type DynControlFunctionFn<T = any> = (...args: any[]) => T;
 export type DynControlFunction<T = any> = DynBaseHandler<DynControlFunctionFn<T>>;
