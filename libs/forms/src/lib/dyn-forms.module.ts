import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';
import { DynFactoryComponent, DynFormComponent, DynGroupComponent } from './components';
import { DynFormsModuleArgs } from './dyn-forms.module.interface';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  exports: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
})
export class DynFormsModule {
  static forFeature(
    args?: DynFormsModuleArgs
  ): ModuleWithProviders<DynFormsModule> {
    return {
      ngModule: DynFormsModule,
      providers: getModuleProviders(args?.controls, args?.providers),
    };
  }
}
