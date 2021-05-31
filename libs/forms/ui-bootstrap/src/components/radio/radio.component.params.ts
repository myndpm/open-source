import { DynControlParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynBsRadioParams extends DynControlParams {
  options: DynOption[];
  inline?: boolean;
}
