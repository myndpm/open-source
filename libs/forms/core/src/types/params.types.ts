import { DynBaseHandler } from './provider.types';

/**
 * control params
 */
export interface DynParams {
  // once merged with the paramFns they can have any type
  [key: string]: any;
}

/**
 * control functions
 * ie. { paramFns: { getValue: 'getOptionText' }}
 */
export type DynFunctionFn<T = any> = (...args: any[]) => T;
export type DynFunction<T = any> = DynBaseHandler<DynFunctionFn<T>>;

/**
 * @deprecated use DynParams
 */
export type DynControlParams = DynParams;

/**
 * @deprecated use DynFunctionFn
 */
export type DynControlFunctionFn = DynFunctionFn;

/**
 * @deprecated use DynFunction
 */
export type DynControlFunction = DynFunction;
