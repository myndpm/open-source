import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynConfigArgs } from './forms.types';
import { DynControlMatch } from './matcher.types';
import { DynControlFunctionFn, DynParams } from './params.types';
import { DynConfigCollection, DynConfigMap, DynConfigProvider } from './provider.types';
import { DynConfigErrors, DynControlErrors } from './validation.types';
import { DynConfigWrapper } from './wrapper.types';

export type DynControlId = string; // Control ID

/**
 * Visibility handled by dyn-factory
 */
 export type DynControlVisibility = 'VISIBLE' | 'INVISIBLE' | 'HIDDEN';

/**
  single dynamic control config
 */
export interface DynControlConfig<TParams extends DynParams = DynParams> {
  // config
  control: DynControlId;
  wrappers?: DynConfigWrapper<TParams>[];
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
