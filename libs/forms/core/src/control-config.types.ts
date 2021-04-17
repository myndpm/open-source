import { Observable } from 'rxjs';
import { DynControlFactoryParams, DynControlParams } from './control-params.types';
import { DynControlTriggers } from './control-validation.types';
import { DynControlType } from './control.types';

export type DynConfigPrimitive = number | string | boolean;

// a plain/serializable value
export type DynConfigArgs = DynConfigPrimitive | DynConfigPrimitive[] | null;

// a given id to the functions
export type DynConfigId = string;

// a collection of ids with arguments to be used
export type DynConfigCollection = { [id: string]: DynConfigArgs }
                                | Array<DynConfigId | [DynConfigId, DynConfigArgs]>;

/**
  single control options
 */
export interface DynControlOptions extends DynControlTriggers {
  defaults?: { // used on FormControls only
    value?: DynConfigArgs;
    disabled?: boolean;
  };
  validators?: DynConfigCollection;
  asyncValidators?: DynConfigCollection;
  // errorHandlers?: DynConfigCollection;
  // matchers?: DynControlMatcher[];
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
