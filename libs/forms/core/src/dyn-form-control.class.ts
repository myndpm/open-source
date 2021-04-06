import { Directive, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynConfig } from './config.interfaces';
import { DynControlContext } from './control-contexts.interfaces';
import { DynControlParams } from './control-params.interfaces';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormControl<
    TContext extends DynControlContext = DynControlContext,
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynConfig<TContext, TParams> = DynConfig<TContext, TParams>
  >
  extends DynControl<TContext, TParams, TConfig, FormControl>
  implements OnInit {
  static dynInstance = DynInstanceType.Control;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name) {
      throw new Error(`No config.name provided for ${this.config.control}`);
    }

    super.ngOnInit();

    this.control = this._fform.register(
      DynInstanceType.Control,
      this.config,
      this.parent
    );
  }
}
