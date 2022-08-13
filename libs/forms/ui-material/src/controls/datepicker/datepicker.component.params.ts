import { DynParams, DynTreeNode } from '@myndpm/dyn-forms/core';

export interface DynMatDatepickerParams extends DynParams {
  placeholder: string;
  readonly?: boolean;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
