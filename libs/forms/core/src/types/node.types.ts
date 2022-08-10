import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DynControlHook } from './events.types';
import { DynInstanceType } from './forms.types';
import { DynParams } from './params.types';

// generic interface of DynFormTreeNode
export interface DynTreeNode<
  TParams extends DynParams = DynParams,
  TControl extends AbstractControl = AbstractControl
> {
  root: DynTreeNode;
  isRoot: boolean;
  name: string|undefined;
  path: string[];

  dynId?: string;
  dynCmp: any;

  instance: DynInstanceType;
  control: TControl;
  params: TParams;

  loaded$: Observable<boolean>;
  ready$: Observable<boolean>;
  mode$: Observable<string>;
  params$: Observable<TParams>;

  visible(): void;
  invisible(): void;
  hidden(): void;

  whenReady(): Observable<boolean>;
  updateParams(params: Partial<TParams>): void;
  callHook(event: DynControlHook): void;

  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;
  patchValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): Subscription;
  valueChanges(path: string): Observable<any>|undefined;

  track(defaultMode?: string): Subscription;
  untrack(mode?: string): void;

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

  searchCmp<T>(
    component: Type<T>,
    predicate?: (node: DynTreeNode) => boolean,
  ): T|undefined;

  exec<T>(
    predicate: (node: DynTreeNode) => T,
  ): T|undefined;
}
