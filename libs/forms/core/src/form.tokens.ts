import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynControlContext, DynMappedContexts } from './control-contexts.interfaces';
import { ControlProvider } from './control-provider.interfaces';

export const DYN_CONTROLS_TOKEN = new InjectionToken<ControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);

export const DYN_CONTEXT = new InjectionToken<BehaviorSubject<DynControlContext>>(
  '@myndpm/dyn-forms/context'
);

export const DYN_CONTEXT_DEFAULTS = new InjectionToken<DynMappedContexts>(
  '@myndpm/dyn-forms/context-defaults'
);
