import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynBaseHandler } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * validators provided in the module individually
 */
export type DynControlValidator = DynBaseHandler<ValidatorFn>;
export type DynControlAsyncValidator = DynBaseHandler<AsyncValidatorFn>;

/**
 * error handlers
 */
export type DynErrorId = string;
export type DynErrorMessage = string|null;

// partial ending or full path of the control
export type DynErrorMessages = Record<string, DynControlErrors>;

// string to be displayed for a particular error
export type DynControlErrors = DynErrorMessage | Record<DynErrorId, DynErrorMessage>;

export type DynErrorHandlerFn = (node: DynTreeNode) => DynErrorMessage;
export type DynErrorHandler = DynBaseHandler<DynErrorHandlerFn>;
