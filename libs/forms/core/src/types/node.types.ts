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
  deep: number;
  index: number;
  isolated: boolean;
  detached: boolean;
  isRoot: boolean;
  isTopLevel: boolean;
  children: DynNode[];
  root: DynNode;
  path: string[];
  route: string[];

  name?: string;
  dynId?: string;
  dynCmp: any;

  instance: DynInstanceType;
  control: TControl;
  params: TParams;

  loaded$: Observable<boolean>;
  ready$: Observable<boolean>;
  mode$: Observable<string>;
  params$: Observable<TParams>;
  hook$: Observable<DynHook>;

  visible(): void;
  invisible(): void;
  hidden(): void;

  whenLoaded(): Observable<boolean>;
  whenReady(): Observable<boolean>;
  updateParams(params: Partial<TParams>, resetPrevious?: boolean): void;
  callHook(event: DynHook): void;
  log(message: string, payload?: any): void;

  reset(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void;
  patchValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): Observable<void>;
  valueChanges(path: string): Observable<any>|undefined;
  detectChanges(): void;
  hasValidator(name: string): boolean;

  track(defaultMode?: string): Observable<void>;
  untrack(mode?: string): void;

  findById(dynId: string): DynNode|undefined;
  findByPath(dynId: string): DynNode|undefined;
  search(path: string): AbstractControl|undefined;
  searchUp(path: string, searchDown?: boolean): AbstractControl|undefined;
  searchDown(path: string): AbstractControl|undefined;
  /**
   * @deprecated use node.searchUp
   */
  query(path: string, searchNodes?: boolean): AbstractControl|undefined;
  /**
   * @deprecated use node.searchDown
   */
  select(path: string): AbstractControl|undefined;

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
