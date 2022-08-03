import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynTreeNode } from './node.types';
import { DynBaseHandler, DynConfigProvider } from './provider.types';

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

/**
 * error handlers config
 */
export type DynConfigErrors<T> = Array<DynConfigProvider<DynErrorHandlerFn>> | T;

export interface DynFormConfigErrors { errorMsgs?: DynConfigErrors<DynErrorMessages> };

/**
 * provided validators
 */
 export type DynControlValidatorFn = (node: DynTreeNode, ...args: any[]) => ValidatorFn;
 export type DynControlValidator = DynBaseHandler<ValidatorFn, DynControlValidatorFn>;

export type DynControlAsyncValidatorFn = (node: DynTreeNode, ...args: any[]) => AsyncValidatorFn;
export type DynControlAsyncValidator = DynBaseHandler<AsyncValidatorFn, DynControlAsyncValidatorFn>;
