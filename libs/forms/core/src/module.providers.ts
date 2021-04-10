import { Provider } from '@angular/core';
import { ControlProvider } from './control-provider.types';
import { DynFormFactory } from './form.factory';
import { DynFormRegistry } from './form.registry';
import { DYN_CONTROLS_TOKEN } from './form.tokens';
import { DynLogDriver, DynLogger, DynLogLevel, DYN_LOG_LEVEL } from './logger';

// utility used by DynFormsModule.forFeature
export function getModuleProviders(
  controls?: ControlProvider[],
  providers?: Provider[],
): Provider[] {
  const baseProviders: Provider[] = [
    {
      provide: DYN_LOG_LEVEL,
      useValue: DynLogLevel.Fatal,
    },
    DynLogDriver,
    DynLogger,
    DynFormRegistry,
    DynFormFactory,
  ];

  if (!controls) {
    return [
      ...baseProviders,
      ...providers ?? []
    ];
  }

  return [
    ...baseProviders,
    ...providers ?? [],
    ...controls.map((control) => ({
      provide: DYN_CONTROLS_TOKEN,
      useValue: control,
      multi: true,
    }))
  ];
}
