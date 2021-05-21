import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynBaseConfig,
  DynControlMode,
  DynFormContainer,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatCardParams } from './card.component.params';

@Component({
  selector: 'dyn-mat-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatCardComponent
extends DynFormContainer<DynControlMode, DynMatCardParams>
implements OnInit {

  static dynControl: 'CARD' = 'CARD';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatCardParams>
  ): DynBaseConfig<M, DynMatCardParams> {
    return {
      ...partial,
      control: DynMatCardComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatCardParams>): DynMatCardParams {
    return params;
  }
}
