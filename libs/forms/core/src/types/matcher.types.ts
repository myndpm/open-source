import { Observable } from 'rxjs';
import { DynConfigArgs } from './forms.types';
import { DynTreeNode } from './node.types';
import { DynBaseHandler, DynConfigId, DynConfigProvider } from './provider.types';

/**
 * when (conditions) then run (matcher)
 */
export interface DynControlMatch {
  matchers: DynConfigProvider<DynControlMatcherFn>[]; // [matcher id | [id, args] | DynControlMatcherFn]
  operator?: 'AND' | 'OR'; // triggers the matcher with all/one truthy condition
  when: Array<DynConfigProvider<DynConditionFn> | DynControlMatchCondition>;
  negate?: boolean; // negate the result of the conditions
}

/**
 * condition
 */
export interface DynControlRelated {
  path: string; // query relative to the control with the matcher
  field?: string; // field to process if the control value is an object
  value?: DynConfigArgs;
  negate?: boolean; // negate the result of the condition
}

export interface DynControlMatchCondition extends DynControlRelated {
  condition?: DynConfigId | DynConditionFn; // defaults to the 'DEFAULT' condition handler
  [key: string]: any; // any parameter to the Condition Factory
}

/**
 * matcher handlers
 * ie. DISABLE, ENABLE, SHOW, HIDE, INVISIBLE, etc
 */
export interface DynControlMatcherArgs {
  node: DynTreeNode;
  hasMatch: boolean;
  firstTime: boolean;
  results: any[];
};
export type DynControlMatcherFn = (args: DynControlMatcherArgs) => void;
export type DynControlMatcher = DynBaseHandler<DynControlMatcherFn>;

/**
 * condition handlers
 */
export type DynConditionFn = (node: DynTreeNode) => Observable<any>;
export type DynCondition = DynBaseHandler<DynConditionFn>;

/**
 * type guard
 */
export function isMatchCondition(value: any): value is DynControlMatchCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}

/**
 * @deprecated use DynConditionFn
 */
export type DynControlConditionFn = DynConditionFn;

/**
 * @deprecated use DynCondition
 */
export type DynControlCondition = DynCondition;
