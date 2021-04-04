import { AbstractControlOptions } from "@angular/forms";
import { Observable } from 'rxjs';
import { DynControlParams } from "./control-params.interface";
import { DynControlType, DynInstanceType } from "./control.types";

export interface DynControlConfig<P extends DynControlParams = DynControlParams> {
  // config
  control: DynControlType;
  instance: DynInstanceType;
  // customizations
  params?: P | Observable<P>;
  options?: AbstractControlOptions;
  // factory?: { cssClass, colSpan }
  // errorHandler: (errors: ValidationErrors) => string
  // contextHandlers: { display: { dynControl, dynParams }, table: ... }
}
