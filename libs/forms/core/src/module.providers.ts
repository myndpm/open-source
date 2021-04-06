import { Provider } from '@angular/core';
import { ControlProvider } from './control-provider.types';
import { DynFormFactory } from './form.factory';
import { DynFormRegistry } from './form.registry';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

// utility used by DynFormsModule.forFeature
export function getModuleProviders(controls?: ControlProvider[]): Provider[] {
  if (!controls) {
    return [DynFormRegistry, DynFormFactory];
  }

  return [
    DynFormRegistry,
    DynFormFactory,
    ...controls.map((control) => ({
      provide: DYN_CONTROLS_TOKEN,
      useValue: control,
      multi: true,
    }))
  ];
}
