import { ThemePalette } from '@angular/material/core';
import { DynNode, DynParams } from '@myndpm/dyn-forms/core';

export interface DynMatCheckboxParams extends DynParams {
  label: string;
  labelPosition: 'before' | 'after';
  color?: ThemePalette;
  indeterminate?: boolean;
  readonly?: boolean;
  // paramFns
  getValue?: (node: DynNode) => string;
}
