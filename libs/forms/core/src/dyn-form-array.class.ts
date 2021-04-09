import { Directive, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
// concrete arrays need to provide DynFormNode
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
      throw new Error(`No config.name provided for ${this.config.control}`);
    }

    // register the control first
    this.control = this._fform.register(
      DynInstanceType.Array,
      this.config,
      this.parent
    );

    // provide the parameters second
    super.ngOnInit();

    // initialize the node at the end
    this.node.init(this.config);
  }

  addItem(): void {
    this.control.push(
      this._fform.build(DynInstanceType.Group, this.config, true)
    );
  }

  removeItem(index: number): void {
    this.control.removeAt(index);
  }
}
