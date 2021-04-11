import { Directive, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormArray<
    TMode extends DynControlMode = DynControlMode,
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
  >
  extends DynControl<TMode, TParams, TConfig, FormArray>
  implements OnInit {
  static dynInstance = DynInstanceType.Array;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name) {
      throw this._logger.unnamedArray(this.config.control);
    }

    // register the control
    this.control = this._formFactory.register(
      DynInstanceType.Array,
      this.config,
      this.node.parent,
    );

    // provide the parameters
    super.ngOnInit();

    // initialize the node
    this.node.init(this.config, this.control);

    // log the successful initialization
    this._logger.nodeInit('dyn-form-array', this.node.path, this.config.control);
  }

  addItem(): void {
    this.control.push(
      this._formFactory.build(DynInstanceType.Group, this.config, true)
    );
  }

  removeItem(index: number): void {
    this.control.removeAt(index);
  }
}
