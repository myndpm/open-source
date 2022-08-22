import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DynHook } from './events.types';
import { DynInstanceType } from './forms.types';
import { DynParams } from './params.types';

// generic interface of DynControlNode service
export interface DynNode<
  TParams extends DynParams = DynParams,
  TControl extends AbstractControl = AbstractControl,
> {
  root: DynNode;
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
  updateParams(params: Partial<TParams>, resetPrevious?: boolean): void;
  callHook(event: DynHook): void;

  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;
  patchValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): Observable<void>;
  valueChanges(path: string): Observable<any>|undefined;

  track(defaultMode?: string): Observable<void>;
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
    predicate?: (node: DynNode) => boolean,
  ): T|undefined;

  searchWrapper<T>(
    component: Type<T>,
  ): T|undefined;

  exec<T>(
    fn: (node: DynNode) => T,
    includeSelf?: boolean,
  ): T|undefined;

  execInWrappers<T>(
    fn: (node: DynNode) => any,
    includeSelf?: boolean,
  ): void;
}

/**
 * @deprecated use DynNode
 */
export type DynTreeNode = DynNode;
