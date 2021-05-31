import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';
import {
  DynBsInputComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynFormsModule,
  ],
  declarations: [
    DynBsInputComponent
  ],
  exports: [
    DynFormsModule, // reduce the boilerplate
  ],
})
export class DynFormsBootstrapModule {
  static forFeature(): ModuleWithProviders<DynFormsBootstrapModule> {
    return {
      ngModule: DynFormsBootstrapModule,
      providers: getModuleProviders({
        controls: [
          {
            control: DynBsInputComponent.dynControl,
            instance: DynBsInputComponent.dynInstance,
            component: DynBsInputComponent,
          },
        ],
      }),
    };
  }
}
