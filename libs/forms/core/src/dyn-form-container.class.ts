import { Directive, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DynBaseConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynMode } from './types/mode.types';
import { DynParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormContainer<
  TMode extends DynMode = DynMode,
  TParams extends DynParams = DynParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, UntypedFormGroup>
implements OnInit {

  static dynInstance = DynInstanceType.Container;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    // containers can initialize the node differently
    this.node.init({
      ...this.config,
      instance: DynInstanceType.Container,
      component: this,
    });

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-container', this.node);
  }
}
