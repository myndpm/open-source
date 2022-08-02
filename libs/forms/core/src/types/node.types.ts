import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlHook } from './events.types';
import { DynControlMode } from './mode.types';
import { DynControlParams } from './params.types';
import { DynInstanceType } from './forms.types';

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

  updateParams(params: Partial<TParams>): void;
  callHook(event: DynControlHook): void;
  query(path: string, searchNodes?: boolean): AbstractControl|null;
  select(path: string): AbstractControl|null;
}
