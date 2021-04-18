import { Inject, Injectable, Optional } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynConfigArgs, DynConfigId, DynConfigProvider } from './control-config.types';
import {
  DynControlCondition,
  DynControlConditionFn,
  DynControlMatchCondition,
  DynControlMatcher,
  DynControlMatcherFn,
  isBaseCondition,
} from './control-matchers.types';
import {
  defaultConditions,
  defaultMatchers,
  DynBaseHandler,
  DynHandlerFactory,
} from './dyn-providers';
import { DYN_MATCHERS_TOKEN, DYN_MATCHER_CONDITIONS_TOKEN } from './form.tokens';

@Injectable()
// injected in the DynFormTreeNode to manage matchers
export class DynFormMatchers {
  // registered matchers and conditions
  matchers = new Map<DynConfigId, DynHandlerFactory<DynControlMatcherFn>>();
  conditions = new Map<DynConfigId, DynHandlerFactory<DynControlConditionFn>>();

  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_MATCHERS_TOKEN) @Optional()
    readonly providedMatchers?: DynControlMatcher[],
    @Inject(DYN_MATCHER_CONDITIONS_TOKEN) @Optional()
    readonly providedConditions?: DynControlCondition[],
  ) {
    // reduce the provided validators according to priority
    this.reduceProvider(
      (this.providedMatchers ?? []).concat(defaultMatchers),
      this.matchers,
    );
    this.reduceProvider(
      (this.providedConditions ?? []).concat(defaultConditions),
      this.conditions,
    );
  }

  getMatcher(config: DynConfigProvider): DynControlMatcherFn {
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

  getCondition(config: DynConfigProvider | DynControlMatchCondition): DynControlConditionFn {
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

  private reduceProvider<T extends DynBaseHandler<any>, V>(
    providers: T[],
    dictionary: Map<DynConfigId, DynHandlerFactory<V>>,
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
