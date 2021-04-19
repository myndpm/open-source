import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynControlCondition, DynControlMatcher } from './control-matchers.types';
import { DynModeControls, DynModeParams, DynControlMode } from './control-mode.types';
import { DynControlFunction } from './control-params.types';
import { DynControlProvider } from './control-provider.types';
import { DynControlAsyncValidator, DynControlValidator } from './control-validation.types';

/**
 * core token gathering the controls in the system
 */
export const DYN_CONTROLS_TOKEN = new InjectionToken<DynControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

/**
 * core tokens for named functions
 */
export const DYN_VALIDATORS_TOKEN = new InjectionToken<DynControlValidator[]>(
  '@myndpm/dyn-forms/validators'
);

export const DYN_ASYNCVALIDATORS_TOKEN = new InjectionToken<DynControlAsyncValidator[]>(
  '@myndpm/dyn-forms/async-validators'
);

export const DYN_MATCHERS_TOKEN = new InjectionToken<DynControlMatcher[]>(
  '@myndpm/dyn-forms/matchers'
);

export const DYN_MATCHER_CONDITIONS_TOKEN = new InjectionToken<DynControlCondition[]>(
  '@myndpm/dyn-forms/matcher-conditions'
);

export const DYN_FUNCTIONS_TOKEN = new InjectionToken<DynControlFunction[]>(
  '@myndpm/dyn-forms/functions'
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
