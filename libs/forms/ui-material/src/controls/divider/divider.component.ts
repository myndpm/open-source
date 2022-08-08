import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DynConfig, DynFormContainer, DynMode, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { DynMatDividerParams } from './divider.component.params';

@Component({
  selector: 'dyn-mat-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynMatDividerComponent
extends DynFormContainer<DynMode, DynMatDividerParams> {

  static dynControl: 'DIVIDER' = 'DIVIDER';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatDividerParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatDividerComponent.dynControl,
    };
  }

  @HostBinding('class.is-invisible')
  get isInvisible(): boolean {
    return Boolean(this.params.invisible);
  }
}
