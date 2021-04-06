import { DynTree } from './tree.types';

// generic type for selectors
export interface DynOption<T = any> {
  text: string;
  value: T;
  disabled?: boolean;
  [field: string]: any;
}

// tree of options
export type DynOptionTree<T = any> = DynTree<DynOption<T>>;
