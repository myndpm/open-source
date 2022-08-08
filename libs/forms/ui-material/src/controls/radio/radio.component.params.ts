import { DynParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynMatRadioParams extends DynParams {
  label?: string;
  options: DynOption[];
  readonly?: boolean;
}
