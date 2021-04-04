import { Directive, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynConfig } from './config.interface';
import { DynControlParams } from './control-params.interface';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormControl<
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynConfig<TParams> = DynConfig<TParams>
  >
  extends DynControl<TParams, TConfig, FormControl>
  implements OnInit {
  static dynInstance = DynInstanceType.Control;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name) {
      throw new Error(`No config.name provided for ${this.config.control}`);
    }

    super.ngOnInit();

    this.control = this._form.register(
      DynInstanceType.Control,
      this.config,
      this.parent
    );
  }
}
