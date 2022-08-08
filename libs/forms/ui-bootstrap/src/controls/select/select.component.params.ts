import { DynParams, DynOption } from '@myndpm/dyn-forms/core';

export interface DynBsSelectParams extends DynParams {
  label?: string;
  options: DynOption[];
  hint?: string;
  size?: 'large' | 'small';
}
