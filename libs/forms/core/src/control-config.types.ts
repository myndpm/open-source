import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlMatch } from './control-matchers.types';
import { DynControlFunctionFn, DynControlParams } from './control-params.types';
import { DynControlErrors, DynErrorHandlerFn } from './control-validation.types';
import { DynControlId, DynWrapperId } from './control.types';

// a given id to a validator/async-validator/error-handler/function
export type DynConfigId = string;

// plain/serializable arguments (no functions)
export type DynConfigPrimitive = undefined | string | boolean | number | Set<any> | RegExp | DynConfigPrimitive[] | { [k: string]: DynConfigPrimitive };
export type DynConfigArgs = DynConfigPrimitive | DynConfigPrimitive[] | null;

// handlers provided can be referenced by id or [id with args]
export type DynConfigProvider<F extends Function> = F | DynConfigId | [DynConfigId, DynConfigArgs];

// object map of handlers
export interface DynConfigMap<T> {
  [field: string]: T;
}
// collection of handlers to be used
export type DynConfigCollection<F extends Function> = { [id: string]: DynConfigArgs } | Array<DynConfigProvider<F>>;

// error handlers config
export type DynConfigErrors<T> = Array<DynConfigProvider<DynErrorHandlerFn>> | T;

/**
  single dynamic control config
 */
export interface DynControlConfig<TParams extends DynControlParams = DynControlParams> {
  // config
  wrapper?: DynWrapperId;
  control: DynControlId;
  // options
  default?: DynConfigArgs | { // used in FormControls only
    value: DynConfigArgs;
    disabled: boolean;
  };
  validators?: DynConfigCollection<ValidatorFn>;
  asyncValidators?: DynConfigCollection<AsyncValidatorFn>;
  updateOn?: 'change' | 'blur' | 'submit'; // Angular FormHooks
  match?: DynControlMatch[]; // conditional tasks
  // customizations
  cssClass?: string;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynControlFunctionFn>>;
  errorMsg?: DynConfigErrors<DynControlErrors>;
}
