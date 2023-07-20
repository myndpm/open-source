import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { DynNode, DynOption } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldParams } from '../../wrappers';

export interface DynMatSelectParams extends Partial<DynMatFormFieldParams> {
  label?: string;
  placeholder: string;
  multiple?: boolean;
  options: DynOption[];
  compareWith: (o1: any, o2: any) => boolean;
  sortComparator: (a: MatOption, b: MatOption, options: MatOption[]) => number;
  panelClass: string | string[] | Set<string> | { [key: string]: any };
  // paramFns
  getValue?: (node: DynNode) => string;
}
