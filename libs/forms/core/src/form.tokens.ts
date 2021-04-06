import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynModeControls, DynModeParams, DynControlMode } from './control-mode.types';
import { ControlProvider } from './control-provider.types';

// core token gathering the controls in the system
export const DYN_CONTROLS_TOKEN = new InjectionToken<ControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

// internal tokens managed by the dyn-form component
export const DYN_MODE = new InjectionToken<BehaviorSubject<DynControlMode>>(
  '@myndpm/dyn-forms/mode'
);

export const DYN_MODE_DEFAULTS = new InjectionToken<DynModeParams>(
  '@myndpm/dyn-forms/mode-defaults'
);

export const DYN_MODE_CONTROL_DEFAULTS = new InjectionToken<DynModeControls>(
  '@myndpm/dyn-forms/mode-control-defaults'
);
