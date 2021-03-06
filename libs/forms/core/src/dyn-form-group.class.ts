import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynControlMode } from './types/mode.types';
import { DynControlParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormGroup<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, FormGroup>
implements OnInit {

  static dynInstance = DynInstanceType.Group;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    // initialize the node
    this.node.onInit(DynInstanceType.Group, this.config);

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-group', this.node);
  }
}
