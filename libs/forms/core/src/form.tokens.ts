import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynCondition, DynControlMatcher } from './types/matcher.types';
import { DynMode, DynModes } from './types/mode.types';
import { DynFunction } from './types/params.types';
import { DynControlAsyncValidator, DynControlValidator, DynErrorHandler } from './types/validation.types';
import { DynControlProvider } from './dyn-control.class';
import { DynWrapperProvider } from './dyn-control-wrapper.class';

/**
 * core tokens gathering the controls and wrappers in the system
 */
export const DYN_CONTROLS_TOKEN = new InjectionToken<DynControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

export const DYN_WRAPPERS_TOKEN = new InjectionToken<DynWrapperProvider[]>(
  '@myndpm/dyn-forms/dyn-wrappers'
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

export const DYN_MATCHER_CONDITIONS_TOKEN = new InjectionToken<DynCondition[]>(
  '@myndpm/dyn-forms/matcher-conditions'
);

export const DYN_FUNCTIONS_TOKEN = new InjectionToken<DynFunction[]>(
  '@myndpm/dyn-forms/functions'
);

export const DYN_ERROR_HANDLERS_TOKEN = new InjectionToken<DynErrorHandler[]>(
  '@myndpm/dyn-forms/error-handlers'
);

/**
 * internal tokens managed by the dyn-form and dyn-group components
 */
export const DYN_MODE = new InjectionToken<BehaviorSubject<DynMode>>(
  '@myndpm/dyn-forms/internal/mode'
);

export const DYN_MODE_CHILD = new InjectionToken<BehaviorSubject<DynMode>>(
  '@myndpm/dyn-forms/internal/mode-child'
);

export const DYN_MODE_DEFAULTS = new InjectionToken<DynModes>(
  '@myndpm/dyn-forms/internal/mode-defaults'
);

export const DYN_MODE_LOCAL = new InjectionToken<DynModes>(
  '@myndpm/dyn-forms/internal/mode-local'
);
