import { Directive, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DynConfig } from './types/config.types';
import { DynControlHook } from './types/events.types';
import { DynInstanceType } from './types/forms.types';
import { DynMode } from './types/mode.types';
import { DynParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

@Directive()
export abstract class DynFormArray<
  TMode extends DynMode = DynMode,
  TParams extends DynParams = DynParams,
  TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, FormArray>
implements OnInit {

  static dynInstance = DynInstanceType.Array;

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name && this.node.parent.instance !== DynInstanceType.Array) {
      throw this._logger.unnamedArray(this.config.control);
    }

    // initialize the node
    this.node.init(DynInstanceType.Array, this.config, this);

    // provide the parameters
    super.ngOnInit();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-array', this.node);
  }

  // hook propagated to child DynControls
  callChildHooks({ hook, payload, plain }: DynControlHook): void {
    if (!plain && !Array.isArray(payload)) {
      return;
    }

    this.node.children.forEach((node, i) => {
      if (plain || payload?.length >= i - 1) {
        node.callHook({
          hook,
          payload: !plain ? payload[i] : payload,
          plain,
        });
      }
    });
  }

  addItem(): void {
    const { control } = this._factory.build(DynInstanceType.Group, this.node, this.config, true);
    this.control.push(control);
    this.node.childsIncrement();
  }

  removeItem(index: number): void {
    this.control.removeAt(index);
    this.node.childsDecrement();
  }

  // matches the incoming quantity of items with the existing controls
  // do not remove any existing data because this is "patch"
  hookPrePatch(payload: any[]): void {
    if (Array.isArray(payload)) {
      const numItems = this.control.controls.length;
      for (let i = Math.max(numItems, payload.length); i >= 1; i--) {
        if (i > numItems) {
          this.addItem();
        } else if (i > payload.length) {
          this.removeItem(i - 1);
        }
      }
      this._ref.markForCheck();
    }
  }
}
