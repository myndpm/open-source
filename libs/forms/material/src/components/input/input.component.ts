import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlContext,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynInputParams } from './input.component.params';

@Component({
  selector: 'dyn-mat-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynInputComponent
  extends DynFormControl<DynControlContext, DynInputParams>
  implements OnInit {
  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynInputParams>
  ): DynConfig<C> {
    return {
      ...partial,
      control: DynInputComponent.dynControl,
    };
  }

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynInputParams>): DynInputParams {
    return {
      ...params,
      floatLabel: params.floatLabel || 'auto',
      type: params.type || 'text',
      placeholder: params.placeholder || '',
    };
  }
}
