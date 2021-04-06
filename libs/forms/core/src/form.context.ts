import { Inject, Injectable } from '@angular/core';
import merge from 'merge';
import { BehaviorSubject, isObservable } from 'rxjs';
import { DynBaseConfig } from './config.interfaces';
import { DynControlConfig } from './control-config.interface';
import { DynControlContext, DynMappedContexts } from './control-contexts.interfaces';
import { DynControlType } from './control.types';
import { DYN_CONTEXT, DYN_CONTEXT_DEFAULTS } from './form.tokens';

@Injectable()
export class DynFormContext {
  constructor(
    @Inject(DYN_CONTEXT) private context$: BehaviorSubject<DynControlContext>,
    @Inject(DYN_CONTEXT_DEFAULTS) private contexts: DynMappedContexts
  ) {}

  // resolves the config to be used by dyn-factory
  // this algorithm decides how to override the main config with context data
  getContextConfig(config: DynBaseConfig): DynBaseConfig {
    const context = this.context$.getValue();
    let result: DynBaseConfig = { ...config, contexts: undefined };

    if (!context) {
      return result;
    }

    if (config.contexts && config.contexts[context]) {
      // overrides any control context set
      result = this.mergeConfigs(result, config.contexts[context]);
    }

    const formContext = this.contexts.get(context);
    if (formContext) {
      const control = this.getControl(result.control, formContext);
      if (control) {
        // overrides any form context set
        result = this.mergeConfigs(result, control);
      }
    }

    return result;
  }

  getControl(id: DynControlType, controls: DynControlConfig[]): DynControlConfig | undefined {
    return controls.find(({ control }) => control === id);
  }

  mergeConfigs(config: DynBaseConfig, context: Partial<DynControlConfig>): DynBaseConfig {
    // custom merge strategy for DynControlConfig
    if (context.control) {
      config.control = context.control;
    }
    if (context.hasOwnProperty('options')) {
      config.options = context.options;
    }
    if (context.hasOwnProperty('factory')) {
      config.factory = context.factory;
    }
    if (context.params) {
      if (!isObservable(context.params) && !isObservable(config.params)) {
        config.params = merge.recursive(true, config.params, context.params);
      } else {
        config.params = context.params;
      }
    }

    return config;
  }
}
