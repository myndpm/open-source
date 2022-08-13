import { FloatLabelType } from '@angular/material/form-field';

export interface DynMatFormFieldParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  readonly?: boolean;
  label?: string;
  hint?: string;
  hintEnd?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
}
