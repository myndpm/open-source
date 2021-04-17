import { DynConfigArgs, DynConfigId } from './control-config.types';
import { DynBaseProvider } from './dyn-providers';

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
  id?: DynConfigId; // defaults to EQUAL condition
  value?: DynConfigArgs;
}

/**
 * match (condition) then run (matcher)
 */
 export interface DynControlMatch {
  match: DynConfigId | [DynConfigId, DynConfigArgs]; // matcher ID | [id, args]
  operator?: 'AND' | 'OR';
  when: Array<DynConfigId | [DynConfigId, DynConfigArgs] | DynControlMatchCondition>;
}

/**
 * matcher runs a feature:
 *
 * id: DISABLE | ENABLE | SHOW | HIDE | INVISIBLE | VALIDATE | etc
 * fn: matcher action (node?) => ?
 * FIXME type the fn
 */
export type DynControlMatcher = DynBaseMatcher<any>;

/**
 * conditions
 * id: condition handler id
 * fn:
 *   provided: (node) => Observable<boolean>
 *   match: object => [Observables] => boolean
 * FIXME type the fn
 */
export type DynControlCondition = DynBaseMatcher<any>;
