import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlContext,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatRadioParams } from './radio.component.params';

@Component({
  selector: 'dyn-mat-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatRadioComponent
  extends DynFormControl<DynControlContext, DynMatRadioParams>
  implements OnInit {
  static dynControl: 'RADIO' = 'RADIO';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynMatRadioParams>
  ): DynConfig<C> {
    return {
      ...partial,
      control: DynMatRadioComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatRadioParams>): DynMatRadioParams {
    return {
      ...params,
      options: params.options || [],
    };
  }
}
