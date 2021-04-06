import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynMatArrayParams extends DynControlParams {
  title?: string;
  subtitle?: string;
  initItem?: boolean;
  addButton?: string;
  addColor?: string;
  removeIcon?: string;
  removeColor?: string;
  readonly?: boolean;
}
