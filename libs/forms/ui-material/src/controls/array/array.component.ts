import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynConfig,
  DynFormArray,
  DynMode,
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
extends DynFormArray<DynMode, DynMatArrayParams, DynConfig>
implements AfterViewInit {

  static dynControl: 'ARRAY' = 'ARRAY';

  static createConfig<M extends DynMode>(
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

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

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
}
