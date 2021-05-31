import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';
import {
  DynBsCheckboxComponent,
  DynBsInputComponent,
  DynBsRadioComponent,
  DynBsSelectComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynFormsModule,
  ],
  declarations: [
    DynBsCheckboxComponent,
    DynBsInputComponent,
    DynBsRadioComponent,
    DynBsSelectComponent,
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
            control: DynBsCheckboxComponent.dynControl,
            instance: DynBsCheckboxComponent.dynInstance,
            component: DynBsCheckboxComponent,
          },
          {
            control: DynBsInputComponent.dynControl,
            instance: DynBsInputComponent.dynInstance,
            component: DynBsInputComponent,
          },
          {
            control: DynBsRadioComponent.dynControl,
            instance: DynBsRadioComponent.dynInstance,
            component: DynBsRadioComponent,
          },
          {
            control: DynBsSelectComponent.dynControl,
            instance: DynBsSelectComponent.dynInstance,
            component: DynBsSelectComponent,
          },
        ],
      }),
    };
  }
}
