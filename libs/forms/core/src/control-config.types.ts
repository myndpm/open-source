import { Observable } from 'rxjs';
import { DynControlMatch } from './control-matchers.types';
import { DynControlFactoryParams, DynControlParams } from './control-params.types';
import { DynControlTriggers } from './control-validation.types';
import { DynControlType } from './control.types';

// a given id to a validator/async-validator/error-handler/function
export type DynConfigId = string;

// plain/serializable arguments (no functions)
export type DynConfigPrimitive = string | boolean | number | RegExp | { [k: string]: DynConfigPrimitive };
export type DynConfigArgs = DynConfigPrimitive | DynConfigPrimitive[] | null;

// handlers provided can be referenced by id or [id with args]
export type DynConfigProvider = DynConfigId | [DynConfigId, DynConfigArgs];
// collection of handlers to be used
export type DynConfigCollection = { [id: string]: DynConfigArgs } | Array<DynConfigProvider>;

/**
  single control options
 */
export interface DynControlOptions extends DynControlTriggers {
  defaults?: DynConfigArgs | { // used on FormControls only
    value?: DynConfigArgs;
    disabled?: boolean;
  };
  validators?: DynConfigCollection;
  asyncValidators?: DynConfigCollection;
  matchers?: DynControlMatch[]; // conditional validations
  // errorHandlers?: DynConfigCollection;
}

/**
  single dynamic control config
 */
export interface DynControlConfig<TParams extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  options?: DynControlOptions;
  // customizations
  factory?: DynControlFactoryParams;
  params?: TParams | Observable<TParams>;
  // functions: DynConfigCollection;
}
