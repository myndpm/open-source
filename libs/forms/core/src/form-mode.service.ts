import { Inject, Injectable } from '@angular/core';
import merge from 'merge';
import { BehaviorSubject, isObservable } from 'rxjs';
import { DynBaseConfig } from './config.types';
import { DynControlConfig } from './control-config.types';
import { DynControlMode, DynControlModes } from './control-mode.types';
import { DYN_MODE, DYN_MODE_DEFAULTS } from './form.tokens';

@Injectable()
// provided by the dyn-form component next to the internal tokens
export class DynFormMode {
  constructor(
    @Inject(DYN_MODE) private readonly mode$: BehaviorSubject<DynControlMode>,
    @Inject(DYN_MODE_DEFAULTS) private readonly modes?: DynControlModes,
  ) {}

  // resolves the config to be used by dyn-factory
  // this algorithm decides how to override the main config with mode customizations
  getModeConfig(config: DynBaseConfig): DynBaseConfig {
    const mode = this.mode$.getValue();
    let result: DynBaseConfig = { ...config, modes: undefined };

    if (!mode) {
      return result;
    }

    // overrides any partial config set in the form.modes[mode]
    if (this.modes && Object.prototype.hasOwnProperty.call(this.modes, mode)) {
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
    if (Object.prototype.hasOwnProperty.call(mode, 'factory')) {
      config.factory = mode.factory;
    }
    // do not override an existing observable (because of modeParams)
    // an observable will need to take in account the mode changes inside
    if (mode.params && !isObservable(config.params)) {
      config.params = !isObservable(mode.params)
        ? merge(true, config.params, mode.params)
        : mode.params;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'paramFns')) {
      config.paramFns = merge(true, config.paramFns, mode.paramFns);
    }

    return config;
  }
}
