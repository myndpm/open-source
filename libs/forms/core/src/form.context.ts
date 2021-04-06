import { Inject, Injectable } from '@angular/core';
import merge from 'merge';
import { BehaviorSubject, isObservable } from 'rxjs';
import { DynBaseConfig } from './config.interfaces';
import { DynControlConfig } from './control-config.interface';
import { DynContextControls, DynContextParams, DynControlContext } from './control-contexts.interfaces';
import { DynControlType } from './control.types';
import { DYN_CONTEXT, DYN_CONTEXT_CONTROL_DEFAULTS, DYN_CONTEXT_DEFAULTS } from './form.tokens';

@Injectable()
export class DynFormContext {
  constructor(
    @Inject(DYN_CONTEXT) private context$: BehaviorSubject<DynControlContext>,
    @Inject(DYN_CONTEXT_DEFAULTS) private contexts?: DynContextParams,
    @Inject(DYN_CONTEXT_CONTROL_DEFAULTS) private controls?: DynContextControls,
  ) {}

  // resolves the config to be used by dyn-factory
  // this algorithm decides how to override the main config with context data
  getContextConfig(config: DynBaseConfig): DynBaseConfig {
    const context = this.context$.getValue();
    let result: DynBaseConfig = { ...config, contexts: undefined };

    if (!context) {
      return result;
    }

    if (this.contexts?.hasOwnProperty(context)) {
      // overrides any params set in the contextParams
      result = this.mergeConfigs(result, { params: this.contexts[context] });
    }

    if (config.contexts && config.contexts[context]) {
      // overrides any control context set
      result = this.mergeConfigs(result, config.contexts[context]);
    }

    if (this.controls?.hasOwnProperty(context)) {
      const control = this.getControl(result.control, this.controls[context]);
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
    // do not override an existing observable (because of contextParams)
    if (context.params && !isObservable(config.params)) {
      config.params = !isObservable(context.params)
        ? merge(true, config.params, context.params)
        : context.params;
    }

    return config;
  }
}
