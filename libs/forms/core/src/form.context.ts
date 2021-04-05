import { Inject, Injectable } from '@angular/core';
import { DynBaseConfig } from './config.interfaces';
import { DynControlConfig } from './control-config.interface';
import { DynControlContext } from './control-contexts.interfaces';
import { DYN_CONTEXT_DEFAULTS } from './form.tokens';

@Injectable()
export class DynFormContext {
  constructor(
    @Inject(DYN_CONTEXT_DEFAULTS) private contexts: Map<DynControlContext, DynControlConfig>
  ) {}

  // resolves the config to be used by dyn-factory
  getContextConfig(config: DynBaseConfig, context?: DynControlContext): DynBaseConfig {
    if (!context || !config.contexts || !config.contexts[context]) {
      return config;
    }

    return {
      ...config,
      ...config.contexts[context]
    };
  }
}
