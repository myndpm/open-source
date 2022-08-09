import { FloatLabelType } from '@angular/material/form-field';
import { DynTreeNode } from '@myndpm/dyn-forms/core';

export interface DynMatFormFieldParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  readonly?: boolean;
  label?: string;
  hint?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
