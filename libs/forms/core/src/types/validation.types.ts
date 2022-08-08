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
 export type DynValidatorFn = (node: DynTreeNode, ...args: any[]) => ValidatorFn;
 export type DynValidator = DynBaseHandler<ValidatorFn, DynValidatorFn>;

export type DynAsyncValidatorFn = (node: DynTreeNode, ...args: any[]) => AsyncValidatorFn;
export type DynAsyncValidator = DynBaseHandler<AsyncValidatorFn, DynAsyncValidatorFn>;

/**
 * @deprecated use DynValidatorFn
 */
export type DynControlValidatorFn = DynValidatorFn;

/**
 * @deprecated use DynValidator
 */
export type DynControlValidator = DynValidator;

/**
 * @deprecated use DynAsyncValidatorFn
 */
export type DynControlAsyncValidatorFn = DynAsyncValidatorFn;

/**
 * @deprecated use DynAsyncValidator
 */
export type DynControlAsyncValidator = DynAsyncValidator;
