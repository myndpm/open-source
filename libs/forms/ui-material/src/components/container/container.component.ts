import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormContainer,
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
extends DynFormContainer<DynControlMode, DynMatContainerParams>
implements OnInit {

  static dynControl: 'CONTAINER' = 'CONTAINER';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatContainerParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatContainerComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatContainerParams>): DynMatContainerParams {
    return {
      ...params,
    };
  }
}
