import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlHook } from './control-events.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';

// generic type for hierarchical trees
export type DynTree<T> = T & {
  children?: T[];
}

// generic interface of DynFormTreeNode
export interface DynTreeNode<
  TParams extends DynControlParams = DynControlParams,
  TControl extends AbstractControl = AbstractControl
> {
  root: DynTreeNode;
  isRoot: boolean;
  name: string|undefined;
  path: string[];

  instance: DynInstanceType;
  control: TControl;
  params: TParams;

  loaded$: Observable<boolean>;
  mode$: Observable<DynControlMode>;

  visible(): void;
  invisible(): void;
  hidden(): void;

  callHook(event: DynControlHook): void;
  query(path: string, searchNodes?: boolean): AbstractControl|null;
  select(path: string): AbstractControl|null;
}
