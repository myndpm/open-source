import { DynControlParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynBsSelectParams extends DynControlParams {
  label?: string;
  options: DynOption[];
  hint?: string;
  size?: 'large' | 'small';
}
