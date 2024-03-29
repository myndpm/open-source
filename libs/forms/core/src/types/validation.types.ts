import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynNode } from './node.types';
import { DynBaseHandler, DynConfigProvider } from './provider.types';

/**
 * error handlers
 */
export type DynErrorId = string;
export type DynErrorMessage = string|null;

// string to be displayed for a particular error
export type DynErrors = DynErrorMessage | Record<DynErrorId, DynErrorMessage>;

// partial ending or full path of the control
export type DynErrorMessages = Record<string, DynErrors>;

export type DynErrorHandlerFn = (node: DynNode) => DynErrorMessage;
export type DynErrorHandler = DynBaseHandler<DynErrorHandlerFn>;

/**
 * error handlers config
 */
export type DynConfigErrors<T> = Array<DynConfigProvider<DynErrorHandlerFn>> | T;

export interface DynFormConfigErrors { errorMsgs?: DynConfigErrors<DynErrorMessages> };

/**
 * provided validators
 */
export type DynValidatorFn = (node: DynNode, ...args: any[]) => ValidatorFn;
export type DynValidator = DynBaseHandler<ValidatorFn, DynValidatorFn>;

export type DynAsyncValidatorFn = (node: DynNode, ...args: any[]) => AsyncValidatorFn;
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

/**
 * @deprecated use DynErrors
 */
export type DynControlErrors = DynErrors;
