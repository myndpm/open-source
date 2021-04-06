import { Directive, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynConfig } from './config.interfaces';
import { DynControlContext } from './control-contexts.interfaces';
import { DynControlParams } from './control-params.interfaces';
import { DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormGroup<
    TContext extends DynControlContext = DynControlContext,
    TParams extends DynControlParams = DynControlParams,
    TConfig extends DynConfig<TContext, TParams> = DynConfig<TContext, TParams>
  >
  extends DynControl<TContext, TParams, TConfig, FormGroup>
  implements OnInit {
  static dynInstance = DynInstanceType.Group;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    super.ngOnInit();

    if (this.config.name) {
      this.control = this._fform.register(
        DynInstanceType.Group,
        this.config,
        this.parent
      );
    } else if (!this.control) {
      // fallback to the parent control (useful for UI subgroups)
      this.control = this.parent.control;
    }
  }
}
