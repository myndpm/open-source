import { ThemePalette } from '@angular/material/core';
import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynMatCheckboxParams extends DynControlParams {
  label: string;
  labelPosition: 'before' | 'after';
  color?: ThemePalette;
  indeterminate?: boolean;
  getValue?: (params: DynMatCheckboxParams, value: any) => any;
  readonly?: boolean;
}
