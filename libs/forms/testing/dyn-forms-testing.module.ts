import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynModuleProviders, getModuleProviders } from '@myndpm/dyn-forms/core';
import { DynFormTestingComponent } from './form/form-testing.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynFormsModule,
  ],
  declarations: [
    DynFormTestingComponent,
  ],
  exports: [
    ReactiveFormsModule,
    DynFormsModule,
  ],
})
export class DynFormsTestingModule {
  static forTest(args?: DynModuleProviders): ModuleWithProviders<DynFormsTestingModule> {
    return {
      ngModule: DynFormsTestingModule,
      providers: getModuleProviders(args),
    };
  }
}
