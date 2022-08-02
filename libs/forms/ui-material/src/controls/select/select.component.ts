import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatOption } from '@angular/material/core';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatSelectParams } from './select.component.params';

@Component({
  selector: 'dyn-mat-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatSelectComponent
extends DynFormControl<DynControlMode, DynMatSelectParams> {

  static dynControl: 'SELECT' = 'SELECT';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatSelectParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatSelectComponent.dynControl,
    };
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
