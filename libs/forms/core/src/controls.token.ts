import { InjectionToken } from '@angular/core';
import { ControlProvider } from './control-provider.interfaces';

export const DYN_CONTROLS_TOKEN = new InjectionToken<ControlProvider[]>(
  '@myndpm/dyn-forms/dyn-controls'
);
