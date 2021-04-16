import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynNatInputParams extends DynControlParams {
  type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
  label?: string;
}
