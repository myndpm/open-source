import { LegacyFloatLabelType as FloatLabelType } from '@angular/material/legacy-form-field';

export interface DynMatFormFieldParams {
  floatLabel?: FloatLabelType; // readonly mode uses 'always' floating label
  hideRequiredMarker?: boolean;
  readonly?: boolean;
  label?: string;
  hint?: string;
  hintEnd?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
}
