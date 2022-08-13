import { DynTreeNode } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldParams } from '../../wrappers';

export interface DynMatDatepickerParams extends Partial<DynMatFormFieldParams> {
  placeholder: string;
  readonly?: boolean;
  // paramFns
  getValue?: (node: DynTreeNode) => string;
}
