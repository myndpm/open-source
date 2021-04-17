import { Inject, Injectable, Optional } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynConfigId } from './control-config.types';
import { DynBaseMatcher, DynControlMatcher, DynControlCondition, DynMatcherFactory } from './control-matchers.types';
import { DYN_MATCHERS_TOKEN, DYN_MATCHER_CONDITIONS_TOKEN } from './form.tokens';

@Injectable()
// injected in the DynFormTreeNode to manage matchers
export class DynFormMatchers {
  // registered matchers and conditions
  matchers = new Map<DynConfigId, any>();
  conditions = new Map<DynConfigId, any>();

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
      (this.providedConditions ?? []),
      this.conditions,
    );
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
