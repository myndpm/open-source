import { DynControlParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynMatRadioParams extends DynControlParams {
  options: DynOption[];
  readonly?: boolean;
}
