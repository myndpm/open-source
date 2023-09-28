import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynControlConfig } from './types/control.types';
import { DynConfigArgs } from './types/forms.types';
import {
  DynCondition,
  DynConditionFn,
  DynMatchCondition,
  DynMatcher,
  DynMatcherFn,
  isMatchCondition,
} from './types/matcher.types';
import { DynNode } from './types/node.types';
import { DynFunction, DynFunctionFn } from './types/params.types';
import {
  DynBaseHandler,
  DynConfigCollection,
  DynConfigId,
  DynConfigMap,
  DynConfigProvider,
  DynHandlerFactory,
} from './types/provider.types';
import {
  DynAsyncValidator,
  DynConfigErrors,
  DynErrorHandler,
  DynErrorHandlerFn,
  DynErrorMessages,
  DynErrors,
  DynValidator,
} from './types/validation.types';
import {
  defaultAsyncValidators,
  defaultConditions,
  defaultErrorHandlers,
  defaultFunctions,
  defaultMatchers,
  defaultValidators,
} from './dyn-providers';
import {
  DYN_ASYNCVALIDATORS_TOKEN,
  DYN_ERROR_HANDLERS_TOKEN,
  DYN_FUNCTIONS_TOKEN,
  DYN_MATCHERS_TOKEN,
  DYN_MATCHER_CONDITIONS_TOKEN,
  DYN_VALIDATORS_TOKEN,
} from './form.tokens';
import { isPlainObject } from './utils/merge.util';

@Injectable()
export class DynFormHandlers {
  // registered handlers
  errorHandlers = new Map<DynConfigId, DynHandlerFactory<DynErrorHandlerFn>>();
  functions = new Map<DynConfigId, DynHandlerFactory<DynFunctionFn>>();
  validators = new Map<DynConfigId, DynHandlerFactory<ValidatorFn>>();
  asyncValidators = new Map<DynConfigId, DynHandlerFactory<AsyncValidatorFn>>();
  matchers = new Map<DynConfigId, DynHandlerFactory<DynMatcherFn>>();
  conditions = new Map<DynConfigId, DynHandlerFactory<DynConditionFn>>();

  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_ERROR_HANDLERS_TOKEN) @Optional()
    readonly providedErrorHandlers?: DynErrorHandler[],
    @Inject(DYN_FUNCTIONS_TOKEN) @Optional()
    readonly providedFunctions?: DynFunction[],
    @Inject(DYN_VALIDATORS_TOKEN) @Optional()
    readonly providedValidators?: DynValidator[],
    @Inject(DYN_ASYNCVALIDATORS_TOKEN) @Optional()
    readonly providedAsyncValidators?: DynAsyncValidator[],
    @Inject(DYN_MATCHERS_TOKEN) @Optional()
    readonly providedMatchers?: DynMatcher[],
    @Inject(DYN_MATCHER_CONDITIONS_TOKEN) @Optional()
    readonly providedConditions?: DynCondition[],
  ) {
    // reduce the provided handlers according to priority
    this.reduceProvider(
      (this.providedValidators ?? []).concat(defaultValidators), // add Angular's default validators
      this.validators,
    );
    this.reduceProvider(
      (this.providedAsyncValidators ?? []).concat(defaultAsyncValidators),
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
      (this.providedErrorHandlers ?? []).concat(defaultErrorHandlers),
      this.errorHandlers,
    );
    this.reduceProvider(
      (this.providedFunctions ?? []).concat(defaultFunctions),
      this.functions,
    );
  }

  getControlOptions(node: DynNode, config?: DynControlConfig): AbstractControlOptions {
    return {
      validators: this.dynValidators(node, this.validators, config?.validators),
      asyncValidators: this.dynValidators(node, this.asyncValidators, config?.asyncValidators),
      updateOn: config?.updateOn,
    }
  }

  getConfigIds(config?: DynConfigCollection<any>): DynConfigId[] {
    const ids: DynConfigId[] = [];
    if (Array.isArray(config)) {
      // array of ids or [id, args] | F
      return config.filter(Boolean).map(id => {
        return this.getId(id);
      });
    } else if (isPlainObject(config)) {
      // object of { id: args }
      return Object.keys(config);
    }
    return ids;
  }

  getMatcher(config: DynConfigProvider<DynMatcherFn>): DynMatcherFn {
    if (typeof config === 'function') {
      return config;
    } else if (Array.isArray(config)) {
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
    config: DynConfigProvider<DynConditionFn> | DynMatchCondition,
  ): DynConditionFn {
    if (typeof config === 'function') {
      return config;
    } else if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.conditions.has(id)) {
        return this.conditions.get(id)!(...this.getArgs(args));
      }
    } else if (isMatchCondition(config)) {
      const id = config.condition ?? 'DEFAULT'; // default condition handler
      if (typeof id === 'function') {
        return id;
      } else if (this.conditions.has(id)) {
        return this.conditions.get(id)!(config);
      }
    } else if (this.conditions.has(config)) {
      return this.conditions.get(config)!();
    }
    throw this.logger.providerNotFound('Condition', config);
  }

  getFormErrorHandlers(
    config?: DynConfigErrors<DynErrorMessages>,
  ): DynErrorHandlerFn[] {
    return config
      ? Array.isArray(config)
        ? config.map(handler => this.getErrorHandler(handler))
        : [this.errorHandlers.get('FORM')!(config)]
      : [];
  }

  getErrorHandlers(
    config?: DynConfigErrors<DynErrors>,
  ): DynErrorHandlerFn[] {
    return config
      ? Array.isArray(config)
        ? config.map(handler => this.getErrorHandler(handler))
        : [this.errorHandlers.get('CONTROL')!(config)]
      : [];
  }

  getErrorHandler(config: DynConfigProvider<DynErrorHandlerFn>): DynErrorHandlerFn {
    if (typeof config === 'function') {
      return config;
    } else if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.errorHandlers.has(id)) {
        return this.errorHandlers.get(id)!(...this.getArgs(args));
      }
    } else if (this.errorHandlers.has(config)) {
      return this.errorHandlers.get(config)!();
    }
    throw this.logger.providerNotFound('Error Handler', config);
  }

  getFunctions(
    config?: DynConfigMap<DynConfigProvider<DynFunctionFn>>,
  ): DynConfigMap<DynFunctionFn> {
    if (!config) {
      return {};
    }
    return Object.keys(config).reduce<DynConfigMap<DynFunctionFn>>(
      (result, field) => {
        result[field] = this.getFunction(config[field]);
        return result;
      },
      {},
    );
  }

  getFunction(config: DynConfigProvider<DynFunctionFn>): DynFunctionFn {
    if (typeof config === 'function') {
      return config;
    } else if (Array.isArray(config)) {
      const [id, args] = config;
      if (this.functions.has(id)) {
        return this.functions.get(id)!(...this.getArgs(args));
      }
    } else if (this.functions.has(config)) {
      return this.functions.get(config)!();
    }
    throw this.logger.providerNotFound('Function', config);
  }

  private dynValidators<F extends Function>(
    node: DynNode,
    dictionary: Map<DynConfigId, DynHandlerFactory<F>>,
    config?: DynConfigCollection<F>,
  ): F[]|null {
    let validators: F[] = [];
    if (Array.isArray(config)) {
      // array of ids or [id, args] | F
      validators = config.filter(Boolean).map(id => {
        return this.getValidatorFn(node, id, dictionary);
      });
    } else if (isPlainObject(config)) {
      // object of { id: args }
      Object.keys(config).forEach(id => {
        validators.push(this.getValidatorFn(node, [id, config[id]], dictionary))
      });
    }
    return validators.length ? validators : null;
  }

  private getValidatorFn<F extends Function>(
    node: DynNode,
    config: DynConfigProvider<F>,
    dictionary: Map<DynConfigId, DynHandlerFactory<F>>,
  ): F {
    if (typeof config === 'function') {
      return config;
    } else if (Array.isArray(config)) {
      const [id, args] = config;
      if (dictionary.has(id)) {
        return dictionary.get(id)!(node, ...this.getArgs(args));
      }
    } else if (dictionary.has(config)) {
      return dictionary.get(config)!(node);
    }
    throw this.logger.providerNotFound('Validator', config);
  }

  private getId<F extends Function>(
    config: DynConfigProvider<F>,
  ): DynConfigId {
    if (typeof config === 'function') {
      return config.constructor.name;
    } else if (Array.isArray(config)) {
      return config[0];
    }
    return config;
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
