import { DynTree } from './tree.types';

// map that could be converted with KeyValue pipe
export type DynOptionsMap<T = any> = Map<T, string>;

// generic type for selectors/radios/etc
export interface DynOption<T = any> {
  key: T;
  value: string;
  disabled?: boolean;
  [field: string]: any;
}

// tree of options
export type DynOptionTree<T = any> = DynTree<DynOption<T>>;
