import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynInputParams extends DynControlParams {
  type: string;
  label?: string;
  placeholder: string;
  hint?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
}
