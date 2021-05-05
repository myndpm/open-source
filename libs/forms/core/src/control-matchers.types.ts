import { Observable } from 'rxjs';
import { DynConfigArgs, DynConfigId, DynConfigProvider } from './control-config.types';
import { DynBaseHandler } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * when (conditions) then run (matcher)
 */
export interface DynControlMatch {
  matchers: DynConfigProvider<DynControlMatcherFn>[]; // [matcher id | [id, args] | DynControlMatcherFn]
  negate?: boolean; // use this matcher in the opposed way
  operator?: 'AND' | 'OR';
  when: Array<DynConfigProvider<DynControlConditionFn> | DynControlMatchCondition>;
}

/**
 * condition
 */
export interface DynControlMatchCondition {
  condition?: DynConfigId | DynControlConditionFn; // defaults to the DEFAULT condition handler
  path: string; // query relative to the control with the matcher
  value?: DynConfigArgs;
  negate?: boolean; // negate the output of the condition
  [key: string]: any; // any parameter to the Condition Factory
}

/**
 * matcher handlers
 * ie. DISABLE | ENABLE | SHOW | HIDE | INVISIBLE | etc
 */
export interface DynControlMatcherFn {
  (node: DynTreeNode, hasMatch: boolean): void;
}
export type DynControlMatcher = DynBaseHandler<DynControlMatcherFn>;

/**
 * condition handlers
 */
export interface DynControlConditionFn {
  (node: DynTreeNode): Observable<boolean>;
}
export type DynControlCondition = DynBaseHandler<DynControlConditionFn>;

/**
 * type guard
 */
export function isMatchCondition(value: any): value is DynControlMatchCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}
