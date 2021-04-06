import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig } from './config.interfaces';
import { DynControlContext } from './control-contexts.interfaces';
import { DynControlParams } from './control-params.interfaces';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormContainer<
    TContext extends DynControlContext = DynControlContext,
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynBaseConfig<TContext, TParams> = DynBaseConfig<TContext, TParams>
  >
  extends DynControl<TContext, TParams, TConfig, FormGroup>
  implements OnInit {
  static dynInstance = DynInstanceType.Container;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    super.ngOnInit();

    if (this.config.name) {
      this.control = this._fform.register(
        DynInstanceType.Container,
        this.config,
        this.parent
      );
    } else if (!this.control) {
      // fallback to the parent control
      this.control = this.parent.control;
    }
  }
}
