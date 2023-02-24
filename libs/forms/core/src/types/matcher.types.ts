import { Observable } from 'rxjs';
import { DynConfigArgs } from './forms.types';
import { DynNode } from './node.types';
import { DynBaseHandler, DynConfigId, DynConfigProvider } from './provider.types';

/**
 * when (conditions) then run (matcher)
 */
export interface DynMatch {
  matchers: DynConfigProvider<DynMatcherFn>[]; // [matcher id | [id, args] | DynMatcherFn]
  operator?: 'AND' | 'OR'; // triggers the matcher with all/one truthy condition
  when: Array<DynConfigProvider<DynConditionFn> | DynMatchCondition>;
  negate?: boolean; // negate the result of the conditions
  debug?: boolean; // show debug output when the matcher is called
}

/**
 * condition
 */
export interface DynMatchRelation {
  path: string; // query relative to the control with the matcher
  field?: string; // field to process if the control value is an object
  value?: DynConfigArgs;
  negate?: boolean; // negate the result of the condition
}

export interface DynMatchCondition extends DynMatchRelation {
  condition?: DynConfigId | DynConditionFn; // defaults to the 'DEFAULT' condition handler
  [key: string]: any; // any parameter to the Condition Factory
}

/**
 * matcher handlers
 * ie. DISABLE, ENABLE, SHOW, HIDE, INVISIBLE, etc
 */
export interface DynMatcherArgs {
  node: DynNode;
  hasMatch: boolean;
  firstTime: boolean;
  results: any[];
  debug?: boolean;
};
export type DynMatcherFn = (args: DynMatcherArgs) => void;
export type DynMatcher = DynBaseHandler<DynMatcherFn>;

/**
 * condition handlers
 */
export type DynConditionFn = (node: DynNode, debug?: boolean) => Observable<any>;
export type DynCondition = DynBaseHandler<DynConditionFn>;

/**
 * type guard
 */
export function isMatchCondition(value: any): value is DynMatchCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}

/**
 * @deprecated use DynMatch
 */
export type DynControlMatch = DynMatch;

/**
 * @deprecated use DynMatchRelation
 */
export type DynControlRelated = DynMatchRelation;

/**
 * @deprecated use DynMatchCondition
 */
export type DynControlMatchCondition = DynMatchCondition;

/**
 * @deprecated use DynMatcherArgs
 */
export type DynControlMatcherArgs = DynMatcherArgs;

/**
 * @deprecated use DynMatcherFn
 */
export type DynControlMatcherFn = DynMatcherFn;

/**
 * @deprecated use DynMatcher
 */
export type DynControlMatcher = DynMatcher;

/**
 * @deprecated use DynConditionFn
 */
export type DynControlConditionFn = DynConditionFn;

/**
 * @deprecated use DynCondition
 */
export type DynControlCondition = DynCondition;
