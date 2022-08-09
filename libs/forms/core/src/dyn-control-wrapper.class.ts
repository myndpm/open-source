import { Directive, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DynParams } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import { DynWrapperConfig, DynWrapperId } from './types/wrapper.types';
import { DynControl } from './dyn-control.class';

export type AbstractDynWrapper = DynWrapper;

export interface DynWrapperProvider extends DynBaseProvider {
  wrapper: DynWrapperId;
  component: Type<AbstractDynWrapper>;
}

@Directive()
export abstract class DynWrapper<
  TParams extends DynParams = DynParams,
  TConfig extends DynWrapperConfig<TParams> = DynWrapperConfig<TParams>,
>
extends DynControl<string, TParams, any, any>
implements OnInit, OnDestroy {
  @ViewChild('dynContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  config!: TConfig;

  ngOnInit(): void {
  }
}
