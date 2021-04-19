import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import {
  DynConfigArgs,
  DynConfigCollection,
  DynConfigId,
  DynConfigMap,
  DynConfigProvider,
  DynControlOptions,
} from './control-config.types';
import {
  DynControlCondition,
  DynControlConditionFn,
  DynControlMatchCondition,
  DynControlMatcher,
  DynControlMatcherFn,
  isBaseCondition,
} from './control-matchers.types';
import { DynControlFunction, DynControlFunctionFn } from './control-params.types';
import { DynAsyncValidatorProvider, DynValidatorProvider } from './control-validation.types';
import {
  defaultConditions,
  defaultFunctions,
  defaultMatchers,
  defaultValidators,
  DynBaseHandler,
  DynHandlerFactory,
} from './dyn-providers';
import {
  DYN_ASYNCVALIDATORS_TOKEN,
  DYN_FUNCTIONS_TOKEN,
  DYN_MATCHERS_TOKEN,
  DYN_MATCHER_CONDITIONS_TOKEN,
  DYN_VALIDATORS_TOKEN,
} from './form.tokens';

@Injectable()
export class DynFormHandlers {
  // registered handlers
  functions = new Map<DynConfigId, DynHandlerFactory<DynControlFunctionFn>>();
  validators = new Map<DynConfigId, DynHandlerFactory<ValidatorFn>>();
  asyncValidators = new Map<DynConfigId, DynHandlerFactory<AsyncValidatorFn>>();
  matchers = new Map<DynConfigId, DynHandlerFactory<DynControlMatcherFn>>();
  conditions = new Map<DynConfigId, DynHandlerFactory<DynControlConditionFn>>();

  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_FUNCTIONS_TOKEN) @Optional()
    readonly providedFunctions?: DynControlFunction[],
    @Inject(DYN_VALIDATORS_TOKEN) @Optional()
    readonly providedValidators?: DynValidatorProvider[],
    @Inject(DYN_ASYNCVALIDATORS_TOKEN) @Optional()
    readonly providedAsyncValidators?: DynAsyncValidatorProvider[],
    @Inject(DYN_MATCHERS_TOKEN) @Optional()
    readonly providedMatchers?: DynControlMatcher[],
    @Inject(DYN_MATCHER_CONDITIONS_TOKEN) @Optional()
    readonly providedConditions?: DynControlCondition[],
  ) {
    // reduce the provided handlers according to priority
    this.reduceProvider(
      (this.providedValidators ?? []).concat(defaultValidators), // add Angular's default validators
      this.validators,
    );
    this.reduceProvider(
      (this.providedAsyncValidators ?? []),
      this.asyncValidators,
    );
    this.reduceProvider(
      (this.providedMatchers ?? []).concat(defaultMatchers),
      this.matchers,
    );
    this.reduceProvider(
      (this.providedConditions ?? []).concat(defaultConditions),
      this.conditions,
    );
    this.reduceProvider(
      (this.providedFunctions ?? []).concat(defaultFunctions),
      this.functions,
    );
  }

  getControlOptions(config?: DynControlOptions): AbstractControlOptions {
    return {
      validators: this.dynValidators(this.validators, config?.validators),
      asyncValidators: this.dynValidators(this.asyncValidators, config?.asyncValidators),
      updateOn: config?.updateOn,
    }
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

  getFunctions(config?: DynConfigMap<DynConfigProvider>): DynConfigMap<DynControlFunctionFn> {
    if (!config) {
      return {};
    }
    return Object.keys(config).reduce<DynConfigMap<DynControlFunctionFn>>(
      (result, field) => {
        result[field] = this.getFunction(config[field]);
        return result;
      },
      {},
    );
  }

  getFunction(config: DynConfigProvider): DynControlFunctionFn {
    if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.functions.has(id)) {
        return this.functions.get(id)!(...this.getArgs(args));
      }
    } else if (this.functions.has(config)) {
      return this.functions.get(config)!();
    }
    throw this.logger.providerNotFound('Function', config);

  }

  private dynValidators<F>(
    dictionary: Map<DynConfigId, DynHandlerFactory<F>>,
    config?: DynConfigCollection,
  ): F[]|null {
    let validators: F[] = [];
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

  private getValidatorFn<F>(
    config: DynConfigProvider,
    dictionary: Map<DynConfigId, DynHandlerFactory<F>>,
  ): F {
    if (Array.isArray(config)) {
      const [id, args] = config;
      if (dictionary.has(id)) {
        return dictionary.get(id)!(...this.getArgs(args));
      }
    } else if (dictionary.has(config)) {
      return dictionary.get(config)!();
    }
    throw this.logger.providerNotFound('Validator', config);
  }

  private getArgs(args: DynConfigArgs): DynConfigArgs[] {
    return args ?? false
      ? Array.isArray(args) ? args : [args]
      : [];
  }

  private reduceProvider<T extends DynBaseHandler<any>, F>(
    providers: T[],
    dictionary: Map<DynConfigId, DynHandlerFactory<F>>,
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
