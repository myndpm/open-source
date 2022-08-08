import { Inject, Injectable } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import deepEqual from 'fast-deep-equal';
import { combineLatest, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynControlConfig } from './types/control.types';
import { DynControlMode, DynControlModes } from './types/mode.types';
import { merge } from './utils/merge.util';
import { DynFormTreeNode } from './form-tree-node.service';
import { DYN_MODE_DEFAULTS } from './form.tokens';

@Injectable()
// provided by the dyn-form and dyn-group components next to the internal tokens
export class DynFormConfigResolver {
  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_MODE_DEFAULTS) private readonly modes?: DynControlModes,
  ) {}

  areEqual(a: any, b: any): boolean {
    return deepEqual(a, b);
  }

  areEquivalent(config: DynBaseConfig, newConfig: DynBaseConfig): boolean {
    return config?.control === newConfig.control &&
      deepEqual(config?.wrappers, newConfig.wrappers) &&
      deepEqual(config?.default, newConfig.default) &&
      deepEqual(config?.validators, newConfig.validators) &&
      deepEqual(config?.asyncValidators, newConfig.asyncValidators) &&
      deepEqual(config?.updateOn, newConfig.updateOn) &&
      deepEqual(config?.match, newConfig.match);
  }

  // resolves the config to be used by dyn-factory
  // this algorithm decides how to override the main config with mode customizations
  getModeConfig(mode: DynControlMode, config: DynBaseConfig, node: DynFormTreeNode): DynBaseConfig {
    let result: DynBaseConfig = {
      ...config,
      controls: config.controls?.filter(Boolean),
    };

    if (!mode) {
      return result;
    }

    // overrides any partial config set in the form.modes[mode]
    if (this.modes && Object.prototype.hasOwnProperty.call(this.modes, mode)) {
      this.logger.controlModes(node, mode, this.modes[mode])
      result = this.mergeConfigs(result, this.modes[mode]!);
    }

    // overrides any customized config in control.modes[mode]
    if (config.modes?.[mode]) {
      result = this.mergeConfigs(result, config.modes[mode]!);
    }

    return result;
  }

  private mergeConfigs(config: DynBaseConfig, mode: Partial<DynControlConfig>): DynBaseConfig {
    // custom merge strategy for DynControlConfig
    if (mode.control) {
      config.control = mode.control;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'wrappers')) {
      config.wrappers = mode.wrappers;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'default')) {
      config.default = mode.default;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'validators')) {
      config.validators = mode.validators;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'asyncValidators')) {
      config.asyncValidators = mode.asyncValidators;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'updateOn')) {
      config.updateOn = mode.updateOn;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'match')) {
      config.match = mode.match;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'cssClass')) {
      config.cssClass = mode.cssClass;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'errorMsg')) {
      config.errorMsg = mode.errorMsg;
    }
    if (mode.params) {
      if (isObservable(config.params) && isObservable(mode.params)) {
        config.params = combineLatest([config.params, mode.params]).pipe(
          map(([params, modeParams]) => merge(params, modeParams))
        );
      } else if (isObservable(config.params)) {
        config.params = config.params.pipe(
          map(params => merge(params, mode.params))
        );
      } else if (isObservable(mode.params)) {
        const params = config.params;
        config.params = mode.params.pipe(
          map(modeParams => merge(params, modeParams))
        );
      } else {
        config.params = merge(true, config.params, mode.params);
      }
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'paramFns')) {
      config.paramFns = merge(true, config.paramFns, mode.paramFns);
    }

    return config;
  }
}
