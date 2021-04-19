import { DynBaseHandler } from './dyn-providers';

// factory params
export interface DynControlFactoryParams {
  cssClass?: string;
}

/**
 * control params
 */
export interface DynControlParams {
  // once merged with the paramFns they can have any type
  [key: string]: any;
}

/**
 * control functions
 * ie. { functions: { getValue: 'getOptionText' }}
 */
 export type DynControlFunctionFn = (...args: any[]) => any;
 export type DynControlFunction = DynBaseHandler<DynControlFunctionFn>;
