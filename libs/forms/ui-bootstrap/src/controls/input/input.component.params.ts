import { DynParams } from '@myndpm/dyn-forms/core';

export interface DynBsInputParams extends DynParams {
  type: 'color' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'textarea';
  label?: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
  size?: 'large' | 'small';
}
