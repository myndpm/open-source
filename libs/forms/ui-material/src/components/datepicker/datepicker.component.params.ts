import { FloatLabelType } from '@angular/material/form-field';
import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynMatDatepickerParams extends DynControlParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  placeholder: string;
  label?: string;
  hint?: string;
  readonly?: boolean;
  getValue?: (params: DynMatDatepickerParams, value: any) => any;
}
