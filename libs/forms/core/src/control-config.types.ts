import { AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlFactoryParams, DynControlParams } from './control-params.types';
import { DynControlType } from './control.types';

// single dynamic control config
export interface DynControlConfig<TParams extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  options?: AbstractControlOptions; // TODO remove when implement plain objects
  /*
  options?: {
    defaults: {
      value?: DynConfigArgs;
      disabled?: boolean;
    };
    validators?: { [name: string]: DynConfigArgs; };
    asyncValidators?: { [name: string]: DynConfigArgs; };
    errorHandlers?: string[];
    updateOn?: 'change' | 'blur' | 'submit';
  };
  */
  // customizations
  factory?: DynControlFactoryParams;
  params?: TParams | Observable<TParams>;
  /*
  // customized params functions
  functions: {
    [name: string]: DynConfigArgs;
  }
  */
}
