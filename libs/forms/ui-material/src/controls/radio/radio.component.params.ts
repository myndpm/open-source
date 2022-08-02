import { DynControlParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynMatRadioParams extends DynControlParams {
  label?: string;
  options: DynOption[];
  readonly?: boolean;
}
