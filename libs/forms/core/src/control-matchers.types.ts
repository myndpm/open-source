import { Observable } from 'rxjs';
import { DynConfigArgs, DynConfigId, DynConfigProvider } from './control-config.types';
import { DynBaseHandler } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * when (conditions) then run (matcher)
 */
export interface DynControlMatch {
  matchers: DynConfigProvider<DynControlMatcherFn>[]; // [matcher id | [id, args] | DynControlMatcherFn]
  negate?: boolean; // negate the input of the matcher
  operator?: 'AND' | 'OR'; // triggers the matcher with all/one truthy condition
  when: Array<DynConfigProvider<DynControlConditionFn> | DynControlMatchCondition>;
}

/**
 * condition
 */
export interface DynControlRelated {
  path: string; // query relative to the control with the matcher
  field?: string; // field to process if the control value is an object
  value?: DynConfigArgs;
  negate?: boolean; // negate the output of the condition
}

export interface DynControlMatchCondition extends DynControlRelated {
  condition?: DynConfigId | DynControlConditionFn; // defaults to the 'DEFAULT' condition handler
  [key: string]: any; // any parameter to the Condition Factory
}

/**
 * matcher handlers
 * ie. DISABLE | ENABLE | SHOW | HIDE | INVISIBLE | etc
 */
export type DynControlMatcherFn = (node: DynTreeNode, hasMatch: boolean, firstTime: boolean) => void;
export type DynControlMatcher = DynBaseHandler<DynControlMatcherFn>;

/**
 * condition handlers
 */
export type DynControlConditionFn = (node: DynTreeNode) => Observable<boolean>;
export type DynControlCondition = DynBaseHandler<DynControlConditionFn>;

/**
 * type guard
 */
export function isMatchCondition(value: any): value is DynControlMatchCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}
