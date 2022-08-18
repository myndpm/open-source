import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynConfigArgs } from './forms.types';
import { DynMatch } from './matcher.types';
import { DynFunctionFn, DynParams } from './params.types';
import { DynConfigCollection, DynConfigMap, DynConfigProvider } from './provider.types';
import { DynConfigErrors, DynErrors } from './validation.types';
import { DynConfigWrapper } from './wrapper.types';

export type DynControlId = string; // Control ID

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
  match?: DynMatch[]; // conditional tasks
  // customizations
  cssClass?: string;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynFunctionFn>>;
  errorMsg?: DynConfigErrors<DynErrors>;
}
