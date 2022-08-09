import { Directive, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DynParams } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import { DynWrapperConfig, DynWrapperId } from './types/wrapper.types';
import { DynControl } from './dyn-control.class';
import { DynInstanceType } from './types/forms.types';

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
    // initialize the node
    this.node.load({
      instance: DynInstanceType.Wrapper,
      control: this.config.wrapper,
      component: this,
    });

    // provide the parameters
    super.ngOnInit();
  }
}
