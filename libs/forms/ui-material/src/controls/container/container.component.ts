import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynConfig,
  DynFormContainer,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatContainerParams } from './container.component.params';

@Component({
  selector: 'dyn-mat-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynMatContainerComponent
extends DynFormContainer<DynMode, DynMatContainerParams> {

  static dynControl: 'CONTAINER' = 'CONTAINER';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatContainerParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatContainerComponent.dynControl,
    };
  }
}
