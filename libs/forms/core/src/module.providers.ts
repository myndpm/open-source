import { Provider, Type } from '@angular/core';
import { DynLogDriver, DynLogger, DynLogLevel, DYN_LOG_LEVEL } from '@myndpm/dyn-forms/logger';
import { DynCondition, DynMatcher } from './types/matcher.types';
import { DynFunction } from './types/params.types';
import { DynAsyncValidator, DynErrorHandler, DynValidator } from './types/validation.types';
import { AbstractDynControl } from './dyn-control.class';
import { AbstractDynWrapper } from './dyn-control-wrapper.class';
import { mapControls, mapPriority, mapWrappers } from './dyn-providers';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DynFormRegistry } from './form-registry.service';
import {
  DYN_ASYNCVALIDATORS_TOKEN,
  DYN_CONTROLS_TOKEN,
  DYN_ERROR_HANDLERS_TOKEN,
  DYN_FUNCTIONS_TOKEN,
  DYN_MATCHERS_TOKEN,
  DYN_MATCHER_CONDITIONS_TOKEN,
  DYN_VALIDATORS_TOKEN,
  DYN_WRAPPERS_TOKEN,
} from './form.tokens';

export interface DynModuleProviders {
  providers?: Provider[];
  controls?: Type<AbstractDynControl>[];
  wrappers?: Type<AbstractDynWrapper>[];
  errorHandlers?: DynErrorHandler[];
  functions?: DynFunction[];
  validators?: DynValidator[];
  asyncValidators?: DynAsyncValidator[];
  matchers?: DynMatcher[];
  conditions?: DynCondition[];
  priority?: number;
  debug?: number;
}

// utility used by DynFormsModule.forFeature
export function getModuleProviders(args?: DynModuleProviders): Provider[] {
  return [
    {
      provide: DYN_LOG_LEVEL,
      useValue: args?.debug || DynLogLevel.Fatal,
    },
    DynLogDriver,
    DynLogger,
    DynFormRegistry,
    DynFormHandlers,
    DynFormFactory,
    ...args?.providers ?? [],
    ...args?.controls?.map(mapControls()).map(mapPriority(args?.priority)).map((control) => ({
      provide: DYN_CONTROLS_TOKEN,
      useValue: control,
      multi: true,
    })) ?? [],
    ...args?.wrappers?.map(mapWrappers()).map(mapPriority(args?.priority)).map((wrapper) => ({
      provide: DYN_WRAPPERS_TOKEN,
      useValue: wrapper,
      multi: true,
    })) ?? [],
    ...args?.errorHandlers?.map(mapPriority(args?.priority)).map((errorHandler) => ({
      provide: DYN_ERROR_HANDLERS_TOKEN,
      useValue: errorHandler,
      multi: true,
    })) ?? [],
    ...args?.functions?.map(mapPriority(args?.priority)).map((fn) => ({
      provide: DYN_FUNCTIONS_TOKEN,
      useValue: fn,
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
    ...args?.matchers?.map(mapPriority(args?.priority)).map((matcher) => ({
      provide: DYN_MATCHERS_TOKEN,
      useValue: matcher,
      multi: true,
    })) ?? [],
    ...args?.conditions?.map(mapPriority(args?.priority)).map((condition) => ({
      provide: DYN_MATCHER_CONDITIONS_TOKEN,
      useValue: condition,
      multi: true,
    })) ?? [],
  ];
}
