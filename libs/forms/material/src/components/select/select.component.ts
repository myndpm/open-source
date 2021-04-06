import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  extends DynFormControl<DynControlMode, DynMatSelectParams>
  implements OnInit {
  static dynControl: 'SELECT' = 'SELECT';

  static createConfig<C extends DynControlMode>(
    partial: DynPartialControlConfig<C, DynMatSelectParams>
  ): DynConfig<C> {
    return {
      ...partial,
      control: DynMatSelectComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatSelectParams>): DynMatSelectParams {
    function compareWith(o1: any, o2: any): boolean {
      // tslint:disable-next-line: triple-equals
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
