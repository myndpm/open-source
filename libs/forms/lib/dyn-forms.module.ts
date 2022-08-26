import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DYN_CONTROLS_TOKEN,
  DynHiddenControlComponent,
  DynHiddenGroupComponent,
  DynModuleProviders,
  getModuleProviders,
} from '@myndpm/dyn-forms/core';
import { DynFactoryComponent, DynFormComponent, DynGroupComponent } from './components';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  entryComponents: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  exports: [DynFactoryComponent, DynFormComponent, DynGroupComponent],
  providers: [
    {
      provide: DYN_CONTROLS_TOKEN,
      useValue: {
        control: DynHiddenControlComponent.dynControl,
        instance: DynHiddenControlComponent.dynInstance,
        component: DynHiddenControlComponent,
      },
      multi: true,
    },
    {
      provide: DYN_CONTROLS_TOKEN,
      useValue: {
        control: DynHiddenGroupComponent.dynControl,
        instance: DynHiddenGroupComponent.dynInstance,
        component: DynHiddenGroupComponent,
      },
      multi: true,
    },
  ],
})
export class DynFormsModule {
  static forFeature(args?: DynModuleProviders): ModuleWithProviders<DynFormsModule> {
    return {
      ngModule: DynFormsModule,
      providers: getModuleProviders(args),
    };
  }
}
