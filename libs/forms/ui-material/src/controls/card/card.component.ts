import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DynBaseConfig,
  DynFormContainer,
  DynMode,
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
extends DynFormContainer<DynMode, DynMatCardParams> {

  static dynControl: 'CARD' = 'CARD';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatCardParams>
  ): DynBaseConfig<M, DynMatCardParams> {
    return {
      ...partial,
      control: DynMatCardComponent.dynControl,
    };
  }
}
