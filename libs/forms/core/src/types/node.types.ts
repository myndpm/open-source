import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynControlHook } from './events.types';
import { DynInstanceType } from './forms.types';
import { DynControlParams } from './params.types';

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
  ready$: Observable<boolean>;
  mode$: Observable<string>;

  visible(): void;
  invisible(): void;
  hidden(): void;

  updateParams(params: Partial<TParams>): void;
  callHook(event: DynControlHook): void;

  search(path: string): AbstractControl|null;
  searchUp(path: string, searchDown?: boolean): AbstractControl|null;
  searchDown(path: string): AbstractControl|null;
  /**
   * @deprecated use node.searchUp
   */
  query(path: string, searchNodes?: boolean): AbstractControl|null;
  /**
   * @deprecated use node.searchDown
   */
  select(path: string): AbstractControl|null;

  whenReady(): Observable<boolean>;
  valueChanges(path: string): Observable<any>|undefined;

  patchValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;
  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;
}
