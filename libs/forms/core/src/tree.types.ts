import { AbstractControl } from '@angular/forms';
import { DynControlHook } from './control-events.types';
import { DynInstanceType } from './control.types';

// generic type for hierarchical trees
export type DynTree<T> = T & {
  children?: T[];
}

// generic interface of DynFormTreeNode
export interface DynTreeNode<TControl extends AbstractControl = AbstractControl> {
  isRoot: boolean;
  name: string|undefined;
  path: string[];

  instance: DynInstanceType;
  control: TControl;

  callHook(event: DynControlHook): void;
  query(path: string, searchNodes?: boolean): AbstractControl|null;
  select(path: string): AbstractControl|null;
}
