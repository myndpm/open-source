import { Directive, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormControl<
    TMode extends DynControlMode = DynControlMode,
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
  >
  extends DynControl<TMode, TParams, TConfig, FormControl>
  implements OnInit {
  static dynInstance = DynInstanceType.Control;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name) {
      throw new Error(`No config.name provided for ${this.config.control}`);
    }

    // register the control first
    this.control = this._fform.register(
      DynInstanceType.Control,
      this.config,
      this.parent
    );

    // provide the parameters second
    super.ngOnInit();
  }
}
