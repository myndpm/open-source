import { ThemePalette } from '@angular/material/core';
import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynMatArrayParams extends DynControlParams {
  title?: string;
  subtitle?: string;
  avatar?: string;
  initItem?: boolean;
  addButton?: string;
  addColor?: ThemePalette;
  removeIcon?: string;
  removeColor?: ThemePalette;
  readonly?: boolean;
}
