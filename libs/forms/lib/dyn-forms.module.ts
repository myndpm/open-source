import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynModuleProviders, getModuleProviders } from '@myndpm/dyn-forms/core';
import { DynFactoryComponent, DynFormComponent, DynGroupComponent } from './components';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  entryComponents: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  exports: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
})
export class DynFormsModule {
  static forFeature(args?: DynModuleProviders): ModuleWithProviders<DynFormsModule> {
    return {
      ngModule: DynFormsModule,
      providers: getModuleProviders(args),
    };
  }
}
