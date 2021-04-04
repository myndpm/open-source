import { DynTree } from './tree.interface';

export interface DynOption<T = unknown> {
  text: string;
  value: T;
  disabled?: boolean;
}

export type DynOptionTree<T = unknown> = DynTree<DynOption<T>>;
