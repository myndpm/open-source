import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynConfigId } from './control-config.types';
import { DynBaseProvider } from './dyn-providers';

/**
 * triggers configuration
 */
 export interface DynControlTriggers {
  invalidOn?: 'touched' | 'submitted';
  updateOn?: 'change' | 'blur' | 'submit'; // Angular FormHooks
}

/**
 * Base types
 */
export type DynValidatorFactory<T> = (...args: any[]) => T;

/**
 * validators provided in the module individually
 */
export interface DynBaseValidatorProvider<T> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynValidatorFactory<T>;
}

export type DynValidatorProvider = DynBaseValidatorProvider<ValidatorFn>;
export type DynAsyncValidatorProvider = DynBaseValidatorProvider<AsyncValidatorFn>;
