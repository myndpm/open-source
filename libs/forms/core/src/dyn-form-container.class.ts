import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynControlMode } from './types/mode.types';
import { DynControlParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormContainer<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, FormGroup>
implements OnInit {

  static dynInstance = DynInstanceType.Container;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    // initialize the node
    if (!this.control) {
      // containers could have initialized the node differently
      this.node.onInit(DynInstanceType.Container, this.config);
    }

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-container', this.node);
  }
}
