import { Directive, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { isObservable, of } from 'rxjs';
import { DynParams } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import { DynWrapperConfig, DynWrapperId } from './types/wrapper.types';
import { DynControl } from './dyn-control.class';
import { DynInstanceType } from './types/forms.types';
import { takeUntil } from 'rxjs/operators';

export type AbstractDynWrapper = DynWrapper<any>;

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
implements OnInit {
  @ViewChild('dynContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  wrapper!: TConfig;

  ngOnInit(): void {
    // initialize the node
    this.node.init({
      ...this.config,
      instance: DynInstanceType.Wrapper,
      wrapper: this.wrapper.wrapper,
      component: this,
    });

    if (this.wrapper.paramFns) {
      this.node.setupParams({}, this.wrapper.paramFns);
    }

    if (this.wrapper.params) {
      (
        isObservable(this.wrapper.params)
          ? this.wrapper.params
          : of(this.wrapper.params || {})
      )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((params) => this.node.updateParams(params));
    }

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-wrapper', this.node);
  }
}
