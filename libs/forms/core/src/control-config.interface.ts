import { AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlFactoryParams, DynControlParams } from './control-params.interfaces';
import { DynControlType } from './control.types';

export interface DynControlConfig<P extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  options?: AbstractControlOptions;
  // customizations
  factory?: DynControlFactoryParams;
  params?: P | Observable<P>;
  // errorHandler: (errors: ValidationErrors) => string
  /* customized lifecycle functions
  dynFns: DynStrategyClass {
    abstract getValue(form, config) => T
    getRequestValue?
  } */
}
