import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynConfigId } from './control-config.types';
import { DynBaseHandler } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * triggers configuration
 */
 export interface DynControlTriggers {
  invalidOn?: 'touched' | 'submitted';
  updateOn?: 'change' | 'blur' | 'submit'; // Angular FormHooks
}

/**
 * validators provided in the module individually
 */
export type DynControlValidator = DynBaseHandler<ValidatorFn>;
export type DynControlAsyncValidator = DynBaseHandler<AsyncValidatorFn>;

/**
 * error handlers
 */
export interface DynErrorMessage {
  id: DynConfigId; // handler that returned it
  message: string; // string to be displayed
}

export interface DynErrorHandlerFn {
  (node: DynTreeNode): DynErrorMessage|null;
}
export type DynErrorHandler = DynBaseHandler<DynErrorHandlerFn>;
