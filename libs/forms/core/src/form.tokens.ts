import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynModeControls, DynModeParams, DynControlMode } from './control-mode.types';
import { ControlProvider } from './control-provider.types';
import { DynAsyncValidatorProvider, DynValidatorProvider } from './control-validation.types';

/**
 * core token gathering the controls in the system
 */
export const DYN_CONTROLS_TOKEN = new InjectionToken<ControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

/**
 * core tokens for named functions
 */
export const DYN_VALIDATORS_TOKEN = new InjectionToken<DynValidatorProvider[]>(
  '@myndpm/dyn-forms/validators'
);

export const DYN_ASYNCVALIDATORS_TOKEN = new InjectionToken<DynAsyncValidatorProvider[]>(
  '@myndpm/dyn-forms/async-validators'
);

/**
 * internal tokens managed by the dyn-form component
 */
export const DYN_MODE = new InjectionToken<BehaviorSubject<DynControlMode>>(
  '@myndpm/dyn-forms/internal/mode'
);

export const DYN_MODE_DEFAULTS = new InjectionToken<DynModeParams>(
  '@myndpm/dyn-forms/internal/mode-defaults'
);

export const DYN_MODE_CONTROL_DEFAULTS = new InjectionToken<DynModeControls>(
  '@myndpm/dyn-forms/internal/mode-control-defaults'
);
