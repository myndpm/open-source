import { Inject, Injectable } from '@angular/core';
import merge from 'merge';
import { BehaviorSubject, isObservable } from 'rxjs';
import { DynBaseConfig } from './config.types';
import { DynControlConfig } from './control-config.types';
import { DynModeControls, DynModeParams, DynControlMode } from './control-mode.types';
import { DynControlType } from './control.types';
import { DYN_MODE, DYN_MODE_CONTROL_DEFAULTS, DYN_MODE_DEFAULTS } from './form.tokens';

@Injectable()
// provided by the dyn-form component next to the internal tokens
export class DynFormMode {
  constructor(
    @Inject(DYN_MODE) private mode$: BehaviorSubject<DynControlMode>,
    @Inject(DYN_MODE_DEFAULTS) private modes?: DynModeParams,
    @Inject(DYN_MODE_CONTROL_DEFAULTS) private controls?: DynModeControls,
  ) {}

  // resolves the config to be used by dyn-factory
  // this algorithm decides how to override the main config with mode customizations
  getModeConfig(config: DynBaseConfig): DynBaseConfig {
    const mode = this.mode$.getValue();
    let result: DynBaseConfig = { ...config, modes: undefined };

    if (!mode) {
      return result;
    }

    // overrides any params set in the form.modeParams[mode]
    if (this.modes && Object.prototype.hasOwnProperty.call(this.modes, mode)) {
      result = this.mergeConfigs(result, { params: this.modes[mode] });
    }

    // overrides any customization set in control.modes[mode]
    if (config.modes?.[mode]) {
      result = this.mergeConfigs(result, config.modes[mode]);
    }

    // overrides any customization set in form.modes[mode][control]
    if (this.controls && Object.prototype.hasOwnProperty.call(this.controls, mode)) {
      const control = this.getControl(result.control, this.controls[mode]);
      if (control) {
        result = this.mergeConfigs(result, control);
      }
    }

    return result;
  }

  getControl(id: DynControlType, controls: DynControlConfig[]): DynControlConfig | undefined {
    return controls.find(({ control }) => control === id);
  }

  mergeConfigs(config: DynBaseConfig, mode: Partial<DynControlConfig>): DynBaseConfig {
    // custom merge strategy for DynControlConfig
    if (mode.control) {
      config.control = mode.control;
    }
    if (Object.prototype.hasOwnProperty.call(mode, 'options')) {
      config.options = mode.options;
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

    return config;
  }
}
