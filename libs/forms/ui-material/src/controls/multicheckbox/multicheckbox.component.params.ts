import { DynControlParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynMatMulticheckboxParams extends DynControlParams {
  label?: string;
  options: DynOption[];
}
