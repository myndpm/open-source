import { AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlParams } from './control-params.interface';
import { DynControlType } from './control.types';

export interface DynControlConfig<P extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  options?: AbstractControlOptions;
  // customizations
  params?: P | Observable<P>;
  // factory?: { cssClass, colSpan }
  // errorHandler: (errors: ValidationErrors) => string
  /* customized lifecycle functions
  dynFns: DynStrategyClass {
    abstract getValue(form, config) => T
    getRequestValue?
  } */
}
