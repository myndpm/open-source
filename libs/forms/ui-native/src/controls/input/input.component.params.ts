import { DynParams } from '@myndpm/dyn-forms/core';

export interface DynNatInputParams extends DynParams {
  type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
  label?: string;
}
