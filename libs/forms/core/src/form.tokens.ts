import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynContextControls, DynContextParams, DynControlContext } from './control-contexts.interfaces';
import { ControlProvider } from './control-provider.interfaces';

export const DYN_CONTROLS_TOKEN = new InjectionToken<ControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

export const DYN_CONTEXT = new InjectionToken<BehaviorSubject<DynControlContext>>(
  '@myndpm/dyn-forms/context'
);

export const DYN_CONTEXT_DEFAULTS = new InjectionToken<DynContextParams>(
  '@myndpm/dyn-forms/context-defaults'
);

export const DYN_CONTEXT_CONTROL_DEFAULTS = new InjectionToken<DynContextControls>(
  '@myndpm/dyn-forms/context-control-defaults'
);
