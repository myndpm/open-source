import { ThemePalette } from '@angular/material/core';
import { DynParams } from '@myndpm/dyn-forms/core';

export interface DynMatArrayParams extends DynParams {
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
