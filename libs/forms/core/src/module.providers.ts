import { Provider } from '@angular/core';
import { ControlProvider } from './control-provider.interfaces';
import { DYN_CONTROLS_TOKEN } from './controls.token';
import { DynFormFactory } from './form.factory';
import { DynFormRegistry } from './form.registry';

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
