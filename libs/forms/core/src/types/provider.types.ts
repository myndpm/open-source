import { DynConfigArgs } from './forms.types';

// a given id to a validator/async-validator/error-handler/function
export type DynConfigId = string;

/**
 * Base types
 */
 export interface DynBaseProvider {
  priority?: number;
}

export type DynHandlerFactory<F> = (...args: any[]) => F;

export interface DynBaseHandler<F> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynHandlerFactory<F>;
}

// handlers provided can be referenced by id or [id with args]
export type DynConfigProvider<F extends Function> = F | DynConfigId | [DynConfigId, DynConfigArgs];

// object map of handlers
export interface DynConfigMap<T> {
  [field: string]: T;
}

// collection of handlers to be used
export type DynConfigCollection<F extends Function> = { [id: string]: DynConfigArgs } | Array<DynConfigProvider<F>>;
