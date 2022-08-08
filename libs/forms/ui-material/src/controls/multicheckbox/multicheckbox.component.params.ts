import { DynParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynMatMulticheckboxParams extends DynParams {
  label?: string;
  options: DynOption[];
}
