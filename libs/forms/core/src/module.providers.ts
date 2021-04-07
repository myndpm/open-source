import { Provider } from '@angular/core';
import { ControlProvider } from './control-provider.types';
import { DynFormFactory } from './form.factory';
import { DynFormRegistry } from './form.registry';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

// utility used by DynFormsModule.forFeature
export function getModuleProviders(
  controls?: ControlProvider[],
  providers?: Provider[],
): Provider[] {
  if (!controls) {
    return [
      DynFormRegistry,
      DynFormFactory,
      ...providers ?? []
    ];
  }

  return [
    DynFormRegistry,
    DynFormFactory,
    ...providers ?? [],
    ...controls.map((control) => ({
      provide: DYN_CONTROLS_TOKEN,
      useValue: control,
      multi: true,
    }))
  ];
}
