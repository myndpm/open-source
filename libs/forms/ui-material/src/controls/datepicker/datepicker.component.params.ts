import { FloatLabelType } from '@angular/material/form-field';
import { DynParams, DynTreeNode } from '@myndpm/dyn-forms/core';

export interface DynMatDatepickerParams extends DynParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  placeholder: string;
  label?: string;
  hint?: string;
  readonly?: boolean;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
