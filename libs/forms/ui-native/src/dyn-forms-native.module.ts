import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import {
  DynNatInputComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynFormsModule,
  ],
  declarations: [
    DynNatInputComponent,
  ],
  exports: [
    // reduce the boilerplate
    DynFormsModule,
  ]
})
export class DynFormsNativeModule {
  static forFeature(): ModuleWithProviders<DynFormsNativeModule> {
    return DynFormsModule.forFeature({
      controls: [
        {
          control: DynNatInputComponent.dynControl,
          instance: DynNatInputComponent.dynInstance,
          component: DynNatInputComponent,
        },
      ],
    }, DynFormsNativeModule);
  }
}
