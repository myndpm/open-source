import { DynParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynBsRadioParams extends DynParams {
  options: DynOption[];
  inline?: boolean;
}
