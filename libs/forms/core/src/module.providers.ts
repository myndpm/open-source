import { Provider } from '@angular/core';
import { DynLogDriver, DynLogger, DynLogLevel, DYN_LOG_LEVEL } from '@myndpm/dyn-forms/logger';
import { ControlProvider } from './control-provider.types';
import { DynAsyncValidatorProvider, DynValidatorProvider } from './control-validation.types';
import { mapPriority } from './dyn-providers';
import { DynFormFactory } from './form-factory.service';
import { DynFormRegistry } from './form-registry.service';
import { DynFormValidators } from './form-validators.service';
import {
  DYN_ASYNCVALIDATORS_TOKEN,
  DYN_CONTROLS_TOKEN,
  DYN_VALIDATORS_TOKEN,
} from './form.tokens';

export interface DynModuleProviders {
  controls?: ControlProvider[];
  providers?: Provider[];
  validators?: DynValidatorProvider[];
  asyncValidators?: DynAsyncValidatorProvider[];
  priority?: number;
}

// utility used by DynFormsModule.forFeature
export function getModuleProviders(args?: DynModuleProviders): Provider[] {
  return [
    {
      provide: DYN_LOG_LEVEL,
      useValue: DynLogLevel.Fatal,
    },
    DynLogDriver,
    DynLogger,
    DynFormRegistry,
    DynFormValidators,
    DynFormFactory,
    ...args?.providers ?? [],
    ...args?.controls?.map(mapPriority(args?.priority)).map((control) => ({
      provide: DYN_CONTROLS_TOKEN,
      useValue: control,
      multi: true,
    })) ?? [],
    ...args?.validators?.map(mapPriority(args?.priority)).map((validator) => ({
      provide: DYN_VALIDATORS_TOKEN,
      useValue: validator,
      multi: true,
    })) ?? [],
    ...args?.asyncValidators?.map(mapPriority(args?.priority)).map((asyncValidator) => ({
      provide: DYN_ASYNCVALIDATORS_TOKEN,
      useValue: asyncValidator,
      multi: true,
    })) ?? [],
  ];
}
