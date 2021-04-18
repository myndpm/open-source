import { Observable } from 'rxjs';
import { DynConfigArgs, DynConfigId, DynConfigProvider } from './control-config.types';
import { DynBaseHandler } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * Base types
 */

export interface DynBaseCondition {
  path: string; // queried relative to the control with the matcher
}

export interface DynControlMatchCondition extends DynBaseCondition {
  id?: DynConfigId; // defaults to the DEFAULT condition handler
  value?: DynConfigArgs;
  negate?: boolean; // negate the output of the handler
}

/**
 * match (condition) then run (matcher)
 */
 export interface DynControlMatch {
  matcher: DynConfigProvider; // matcher id | [id, args]
  negate?: boolean; // use this matcher in the opposed way (ie. DISABLE -> ENABLE)
  operator?: 'AND' | 'OR';
  when: Array<DynConfigProvider | DynControlMatchCondition>;
}

/**
 * matcher handlers
 * ie. DISABLE | ENABLE | SHOW | HIDE | INVISIBLE | etc
 */
export type DynControlMatcherFn = (node: DynTreeNode, hasMatch: boolean) => void;
export type DynControlMatcher = DynBaseHandler<DynControlMatcherFn>;

/**
 * condition handlers
 */
export type DynControlConditionFn = (node: DynTreeNode) => Observable<boolean>;
export type DynControlCondition = DynBaseHandler<DynControlConditionFn>;

/**
 * type guard
 */
export function isBaseCondition(value: any): value is DynBaseCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}
