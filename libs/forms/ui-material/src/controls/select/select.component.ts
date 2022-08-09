import { ChangeDetectionStrategy, Component, HostBinding, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  DynConfig,
  DynFormControl,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatFormFieldWrapper } from '../../wrappers';
import { DynMatSelectParams } from './select.component.params';

@Component({
  selector: 'dyn-mat-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatSelectComponent
extends DynFormControl<DynMode, DynMatSelectParams> {

  static dynControl: 'SELECT' = 'SELECT';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatSelectParams>
  ): DynConfig<M> {
    return {
      wrappers: ['FORM-FIELD'],
      ...partial,
      control: DynMatSelectComponent.dynControl,
    };
  }

  @ViewChild(MatFormFieldControl, { static: true })
  fieldControl!: MatFormFieldControl<any>;

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // register into the closes mat-form-field wrapper
    this.node.searchCmp(
      DynMatFormFieldWrapper,
      ({ instance }) => instance === 'WRAPPER',
    )?.attachControl(this.fieldControl);
  }

  completeParams(params: Partial<DynMatSelectParams>): DynMatSelectParams {
    function compareWith(o1: any, o2: any): boolean {
      return o1 == o2;
    }

    function sortComparator(a: MatOption, b: MatOption): number {
      return a.value.localeCompare(b.value);
    }

    return {
      ...params,
      placeholder: params.placeholder || '',
      multiple: Boolean(params.multiple),
      options: params.options || [],
      compareWith: params.compareWith || compareWith,
      sortComparator: params.sortComparator || sortComparator,
      panelClass: params.panelClass || '',
    };
  }
}
