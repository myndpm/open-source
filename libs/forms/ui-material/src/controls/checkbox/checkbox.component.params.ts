import { ThemePalette } from '@angular/material/core';
import { DynControlParams, DynTreeNode } from '@myndpm/dyn-forms/core';

export interface DynMatCheckboxParams extends DynControlParams {
  label: string;
  labelPosition: 'before' | 'after';
  color?: ThemePalette;
  indeterminate?: boolean;
  readonly?: boolean;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
