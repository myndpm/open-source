import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
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
    // register the control
    if (this.config.name) {
      this.control = this._formFactory.register(
        DynInstanceType.Container,
        this.config,
        this.node.parent,
      );
    } else if (!this.control) {
      // fallback to the parent control
      this.control = this.node.parent.control;
    }

    // provide the parameters
    super.ngOnInit();

    // initialize the node
    this.node.load(this.config, this.control);

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-container', this.node.path, this.config.control);
  }
}
