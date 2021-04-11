import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynConfig,
  DynControlMode,
  DynFormArray,
  DynInstanceType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatArrayParams } from './array.component.params';

@Component({
  selector: 'dyn-mat-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatArrayComponent
extends DynFormArray<DynControlMode, DynMatArrayParams, DynConfig>
implements OnInit, AfterViewInit {

  static dynControl: 'ARRAY' = 'ARRAY';

  dynInstanceType = DynInstanceType;

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatArrayParams>
  ): DynConfig<M, DynMatArrayParams> {
    return {
      ...partial,
      control: DynMatArrayComponent.dynControl,
    };
  }

  get items(): FormGroup[] {
    return this.control.controls as FormGroup[];
  }

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    if (this.params.initItem && !this.control.length) {
      this.addItem();
      this._ref.markForCheck();
    }
  }

  completeParams(params: Partial<DynMatArrayParams>): DynMatArrayParams {
    return {
      ...params,
      addButton: params.addButton || 'Add Item',
      addColor: params.addColor || 'accent',
      removeIcon: params.removeIcon || 'close',
      removeColor: params.removeColor || 'accent',
    };
  }

  // matches the incoming quantity of items with the existing controls
  hookPrePatch(payload: any[]): void {
    if (Array.isArray(payload)) {
      const numItems = this.control.controls.length;
      for (let i = 1; i <= Math.max(numItems, payload.length); i++) {
        if (i > numItems) {
          this.addItem();
        } else if (i >= payload.length) {
          this.removeItem(i);
        }
      }
    }
  }
}
