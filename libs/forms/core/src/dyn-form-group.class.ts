import { Directive, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DynConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynMode } from './types/mode.types';
import { DynParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormGroup<
  TMode extends DynMode = DynMode,
  TParams extends DynParams = DynParams,
  TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, UntypedFormGroup>
implements OnInit {

  static dynInstance = DynInstanceType.Group;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    // initialize the node
    this.node.init({
      ...this.config,
      instance: DynInstanceType.Group,
      component: this,
    });

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-group', this.node);
  }
}
