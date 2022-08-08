import { Directive, Type } from '@angular/core';
import { DynBaseProvider } from './types/provider.types';
import { DynWrapperId } from './types/wrapper.types';

export type AbstractDynWrapper = DynWrapper;

export interface DynWrapperProvider extends DynBaseProvider {
  wrapper: DynWrapperId;
  component: Type<AbstractDynWrapper>;
}

@Directive()
export abstract class DynWrapper {
}
