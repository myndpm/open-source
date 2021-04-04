import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import {
  DynConfig,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynSelectParams } from './select.component.params';

@Component({
  selector: 'dyn-mat-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynSelectComponent
  extends DynFormControl<DynSelectParams>
  implements OnInit {
  static dynControl: 'SELECT' = 'SELECT';

  static createConfig(
    partial: DynPartialControlConfig<DynSelectParams>
  ): DynConfig {
    return {
      ...partial,
      control: DynSelectComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynSelectParams>): DynSelectParams {
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
