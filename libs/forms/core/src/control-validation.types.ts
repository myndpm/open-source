import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
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
 export type DynErrorMessage = string|null;

 export interface DynErrorMessages {
  [path: string]: DynControlErrors; // partial ending or full path of the control
}

export interface DynControlErrors {
  [error: string]: string; // string to be displayed for a particular error
}

export interface DynErrorHandlerFn {
  (node: DynTreeNode): DynErrorMessage;
}
export type DynErrorHandler = DynBaseHandler<DynErrorHandlerFn>;
