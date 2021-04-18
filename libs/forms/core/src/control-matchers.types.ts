import { Observable } from 'rxjs';
import { DynConfigArgs, DynConfigId } from './control-config.types';
import { DynBaseProvider } from './dyn-providers';
import { DynTreeNode } from './tree.types';

/**
 * Base types
 */
export type DynMatcherFactory<F> = (...args: any[]) => F;

export interface DynBaseMatcher<F> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynMatcherFactory<F>;
}

export interface DynBaseCondition {
  path: string; // queried relative to the control with the matcher
}

export interface DynControlMatchCondition extends DynBaseCondition {
  id?: DynConfigId; // defaults to the DEFAULT condition handler
  value?: DynConfigArgs;
  negation?: boolean; // negate the output of the handler
}

/**
 * match (condition) then run (matcher)
 */
 export interface DynControlMatch {
  matcher: DynConfigId | [DynConfigId, DynConfigArgs]; // matcher id | [id, args]
  operator?: 'AND' | 'OR';
  when: Array<DynConfigId | [DynConfigId, DynConfigArgs] | DynControlMatchCondition>;
}

/**
 * matcher runs a feature:
 *
 * id: DISABLE | ENABLE | SHOW | HIDE | INVISIBLE | VALIDATE | etc
 * fn: matcher action (node?) => ?
 */
export type DynControlMatcherFn = (node: DynTreeNode, hasMatch: boolean) => void;
export type DynControlMatcher = DynBaseMatcher<any>;

/**
 * conditions
 * id: condition handler id
 * fn:
 *   provided: (node) => Observable<boolean>
 *   match: object => [Observables] => boolean
 */
export type DynControlConditionFn = (node: DynTreeNode) => Observable<boolean>;
export type DynControlCondition = DynBaseMatcher<DynControlConditionFn>;

/**
 * type guard
 */
export function isBaseCondition(value: any): value is DynBaseCondition {
  return !Array.isArray(value) && typeof value === 'object' && value.path;
}
