import { FloatLabelType } from '@angular/material/form-field';
import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynInputParams extends DynControlParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  type: string;
  placeholder: string;
  label?: string;
  hint?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
  readonly?: boolean;
  getValue?: Function;
}
