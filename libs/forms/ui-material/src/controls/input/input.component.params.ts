import { ErrorStateMatcher } from '@angular/material/core';
import { DynParams } from '@myndpm/dyn-forms/core';

export interface DynMatInputParams extends DynParams {
  type: 'color' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'textarea';
  placeholder: string;
  readonly?: boolean;
  rows?: number; // for textarea type
  errorStateMatcher: ErrorStateMatcher;
}
