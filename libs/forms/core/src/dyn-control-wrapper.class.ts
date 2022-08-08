import { Directive, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynParams } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import { DynWrapperConfig, DynWrapperId } from './types/wrapper.types';
import { DynControlNode } from './dyn-control-node.class';

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
extends DynControlNode<TParams, any>
implements OnInit, OnDestroy {
  @ViewChild('dynContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  config!: TConfig;
  get params(): TParams {
    return this.params$.getValue();
  }

  readonly params$ = new BehaviorSubject<TParams>({} as TParams);

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.params$.complete();
  }
}
