import { AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlFactoryParams, DynControlParams } from './control-params.types';
import { DynControlType } from './control.types';

// single dynamic control config
export interface DynControlConfig<P extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  options?: AbstractControlOptions;
  // customizations
  factory?: DynControlFactoryParams;
  params?: P | Observable<P>;
  // errorHandler: (errors: ValidationErrors) => string
  /*
  customized lifecycle functions
  dynFns: DynStrategyClass {
    abstract getValue(form, config) => T
    getRequestValue?
  }
  */
}
