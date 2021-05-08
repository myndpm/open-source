import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { DynControlParams, DynTreeNode } from '@myndpm/dyn-forms/core';

export interface DynMatInputParams extends DynControlParams {
  floatLabel: FloatLabelType; // readonly mode uses 'always' floating label
  type: 'color' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'textarea';
  placeholder: string;
  label?: string;
  hint?: string;
  iconPrefix?: string;
  iconSuffix?: string;
  textSuffix?: string;
  readonly?: boolean;
  rows?: number; // for textarea type
  errorStateMatcher: ErrorStateMatcher;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
