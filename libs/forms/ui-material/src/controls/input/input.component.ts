import { ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  DynConfig,
  DynFormControl,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatFormFieldWrapper } from '../../wrappers';
import { DynMatInputParams } from './input.component.params';

const errorStateMatcher: ErrorStateMatcher = {
  isErrorState: (control) => {
    return Boolean(control?.invalid && control.touched);
  },
};

@Component({
  selector: 'dyn-mat-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatInputComponent
extends DynFormControl<DynMode, DynMatInputParams> {

  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatInputParams>
  ): DynConfig<M> {
    return {
      wrappers: ['FORM-FIELD'],
      ...partial,
      control: DynMatInputComponent.dynControl,
    };
  }

  @ViewChild(MatFormFieldControl)
  fieldControl!: MatFormFieldControl<any>;

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // register into the closest mat-form-field wrapper
    this.node.searchWrapper(DynMatFormFieldWrapper)?.attachControl(this.fieldControl);
  }

  completeParams(params: Partial<DynMatInputParams>): DynMatInputParams {
    return {
      ...params,
      type: params.type || 'text',
      placeholder: params.placeholder || '',
      rows: params.rows || 3,
      errorStateMatcher: params.errorStateMatcher || errorStateMatcher,
    };
  }
}
