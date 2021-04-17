import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynConfigArgs, DynConfigCollection, DynConfigId, DynControlOptions } from './control-config.types';
import { DynAsyncValidatorProvider, DynBaseValidatorProvider, DynValidatorFactory, DynValidatorProvider } from './control-validation.types';
import { defaultValidators } from './dyn-providers';
import { DYN_ASYNCVALIDATORS_TOKEN, DYN_VALIDATORS_TOKEN } from './form.tokens';

@Injectable()
// injected in the DynFormFactory to complete the controls options
export class DynFormValidators {
  // registered validators
  validators = new Map<DynConfigId, DynValidatorFactory<ValidatorFn>>();
  asyncValidators = new Map<DynConfigId, DynValidatorFactory<AsyncValidatorFn>>();

  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_VALIDATORS_TOKEN) @Optional()
    readonly providedValidators?: DynValidatorProvider[],
    @Inject(DYN_ASYNCVALIDATORS_TOKEN) @Optional()
    readonly providedAsyncValidators?: DynAsyncValidatorProvider[],
  ) {
    // reduce the provided validators according to priority
    this.reduceProvider(
      (this.providedValidators ?? []).concat(defaultValidators), // add Angular's default validators
      this.validators,
    );
    this.reduceProvider(
      (this.providedAsyncValidators ?? []),
      this.asyncValidators,
    );
  }

  /**
   * Config translators
   */
  dynOptions(config?: DynControlOptions): AbstractControlOptions {
    return {
      validators: this.dynValidators(this.validators, config?.validators),
      asyncValidators: this.dynValidators(this.asyncValidators, config?.asyncValidators),
      updateOn: config?.updateOn,
    }
  }

  private dynValidators<V>(
    dictionary: Map<DynConfigId, DynValidatorFactory<V>>,
    config?: DynConfigCollection,
  ): V[]|null {
    let validators: V[] = [];
    if (Array.isArray(config)) {
      // array of ids or [id, args]
      validators = config.map(id => this.getValidatorFn(id, dictionary));
    } else if (config) {
      // object of { id: args }
      Object.keys(config).forEach(id => {
        validators.push(this.getValidatorFn([id, config[id]], dictionary))
      });
    }
    return validators.length ? validators : null;
  }

  private getValidatorFn<V>(
    id: DynConfigId | [DynConfigId, DynConfigArgs],
    dictionary: Map<DynConfigId, DynValidatorFactory<V>>,
  ): V {
    if (Array.isArray(id)) {
      const [vid, args] = id;
      if (dictionary.has(vid)) {
        return (dictionary.get(vid) as DynValidatorFactory<V>)(...this.getArgs(args));
      }
    } else if (dictionary.has(id)) {
      return (dictionary.get(id) as DynValidatorFactory<V>)();
    }
    throw this.logger.validatorNotFound(id);
  }

  private getArgs(args: DynConfigArgs): DynConfigArgs[] {
    return args ?? false
      ? Array.isArray(args) ? args : [args]
      : [];
  }

  private reduceProvider<T extends DynBaseValidatorProvider<any>, V>(
    providers: T[],
    dictionary: Map<DynConfigId, DynValidatorFactory<V>>,
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
        // keep only the ValidatorFn in the register
        dictionary.set(validator.id, validator.fn);
      });
  }
}
