import { ErrorStateMatcher } from '@angular/material/core';
import { DynTreeNode } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldParams } from '../../wrappers';

export interface DynMatInputParams extends Partial<DynMatFormFieldParams> {
  type: 'color' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'textarea';
  placeholder: string;
  readonly?: boolean;
  rows?: number; // for textarea type
  errorStateMatcher: ErrorStateMatcher;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
