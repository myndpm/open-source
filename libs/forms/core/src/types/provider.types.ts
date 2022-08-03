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

export interface DynBaseHandler<F, H = DynHandlerFactory<F>> extends DynBaseProvider {
  id: DynConfigId;
  fn: H;
}

// handlers provided can be referenced by id or [id with args]
export type DynConfigProvider<F extends Function> = F | DynConfigId | [DynConfigId, DynConfigArgs];

// object map of handlers
export type DynConfigMap<T> = Record<string, T>;

// collection of handlers to be used
export type DynConfigCollection<F extends Function> = Record<DynConfigId, DynConfigArgs> | Array<DynConfigProvider<F>>;
