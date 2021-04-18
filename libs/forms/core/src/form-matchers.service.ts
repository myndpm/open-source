import { Inject, Injectable, Optional } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynConfigArgs, DynConfigId } from './control-config.types';
import {
  DynBaseMatcher,
  DynControlCondition,
  DynControlConditionFn,
  DynControlMatchCondition,
  DynControlMatcher,
  DynMatcherFactory,
  isBaseCondition,
} from './control-matchers.types';
import { defaultConditions } from './dyn-providers';
import { DYN_MATCHERS_TOKEN, DYN_MATCHER_CONDITIONS_TOKEN } from './form.tokens';

@Injectable()
// injected in the DynFormTreeNode to manage matchers
export class DynFormMatchers {
  // registered matchers and conditions
  matchers = new Map<DynConfigId, DynMatcherFactory<any>>();
  conditions = new Map<DynConfigId, DynMatcherFactory<DynControlConditionFn>>();

  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_MATCHERS_TOKEN) @Optional()
    readonly providedMatchers?: DynControlMatcher[],
    @Inject(DYN_MATCHER_CONDITIONS_TOKEN) @Optional()
    readonly providedConditions?: DynControlCondition[],
  ) {
    // reduce the provided validators according to priority
    this.reduceProvider(
      (this.providedMatchers ?? []),
      this.matchers,
    );
    this.reduceProvider(
      (this.providedConditions ?? []).concat(defaultConditions),
      this.conditions,
    );
  }

  getMatcher<V>(
    config: DynConfigId | [DynConfigId, DynConfigArgs],
  ): V {
    if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.matchers.has(id)) {
        return this.matchers.get(id)!(...this.getArgs(args));
      }
    } else if (this.matchers.has(config)) {
      return this.matchers.get(config)!();
    }
    throw this.logger.providerNotFound('Matcher', config);
  }

  getCondition(
    config: DynConfigId | [DynConfigId, DynConfigArgs] | DynControlMatchCondition,
  ): DynControlConditionFn {
    if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.conditions.has(id)) {
        return this.conditions.get(id)!(...this.getArgs(args));
      }
    } else if (isBaseCondition(config)) {
      const id = config.id ?? 'DEFAULT'; // default condition handler
      if (this.conditions.has(id)) {
        return this.conditions.get(id)!(config);
      }
    } else if (this.conditions.has(config)) {
      return this.conditions.get(config)!();
    }
    throw this.logger.providerNotFound('Condition', config);
  }

  private getArgs(args: DynConfigArgs): DynConfigArgs[] {
    return args ?? false
      ? Array.isArray(args) ? args : [args]
      : [];
  }

  private reduceProvider<T extends DynBaseMatcher<any>, V>(
    providers: T[],
    dictionary: Map<DynConfigId, DynMatcherFactory<V>>,
  ): void {
    // FIXME validate the data-integrity of the provided values and throw logger
    providers
      .reduce(
        // reduce the validators according to the priority
        (map, validator) => {
          if (!map.has(validator.id)
          || ((validator.priority ?? 0) > (map.get(validator.id)?.priority ?? 0))) {
            map.set(validator.id, validator);
          }
          return map;
        },
        new Map<DynConfigId, T>(),
      ).forEach(validator => {
        // keep only the fn in the register
        dictionary.set(validator.id, validator.fn);
      });
  }
}
