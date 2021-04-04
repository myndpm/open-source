import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';
import { FactoryComponent, FormComponent, GroupComponent } from './components';
import { DynFormsModuleArgs } from './dyn-forms.module.interface';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FactoryComponent, FormComponent, GroupComponent],
  exports: [FactoryComponent, FormComponent, GroupComponent],
})
export class DynFormsModule {
  static forFeature(
    args?: DynFormsModuleArgs
  ): ModuleWithProviders<DynFormsModule> {
    return {
      ngModule: DynFormsModule,
      providers: getModuleProviders(args?.controls),
    };
  }
}
