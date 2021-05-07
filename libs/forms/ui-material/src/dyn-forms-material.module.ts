import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';
import {
  DynMatArrayComponent,
  DynMatCardComponent,
  DynMatCheckboxComponent,
  DynMatContainerComponent,
  DynMatDatepickerComponent,
  DynMatDividerComponent,
  DynMatInputComponent,
  DynMatMulticheckboxComponent,
  DynMatRadioComponent,
  DynMatSelectComponent,
} from './components';

export const PROVIDERS = getModuleProviders({
  providers: [
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  ],
  controls: [
    {
      control: DynMatArrayComponent.dynControl,
      instance: DynMatArrayComponent.dynInstance,
      component: DynMatArrayComponent,
    },
    {
      control: DynMatCardComponent.dynControl,
      instance: DynMatCardComponent.dynInstance,
      component: DynMatCardComponent,
    },
    {
      control: DynMatCheckboxComponent.dynControl,
      instance: DynMatCheckboxComponent.dynInstance,
      component: DynMatCheckboxComponent,
    },
    {
      control: DynMatContainerComponent.dynControl,
      instance: DynMatContainerComponent.dynInstance,
      component: DynMatContainerComponent,
    },
    {
      control: DynMatDatepickerComponent.dynControl,
      instance: DynMatDatepickerComponent.dynInstance,
      component: DynMatDatepickerComponent,
    },
    {
      control: DynMatDividerComponent.dynControl,
      instance: DynMatDividerComponent.dynInstance,
      component: DynMatDividerComponent,
    },
    {
      control: DynMatInputComponent.dynControl,
      instance: DynMatInputComponent.dynInstance,
      component: DynMatInputComponent,
    },
    {
      control: DynMatMulticheckboxComponent.dynControl,
      instance: DynMatMulticheckboxComponent.dynInstance,
      component: DynMatMulticheckboxComponent,
    },
    {
      control: DynMatRadioComponent.dynControl,
      instance: DynMatRadioComponent.dynInstance,
      component: DynMatRadioComponent,
    },
    {
      control: DynMatSelectComponent.dynControl,
      instance: DynMatSelectComponent.dynInstance,
      component: DynMatSelectComponent,
    },
  ],
});

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    DynFormsModule,
  ],
  declarations: [
    DynMatArrayComponent,
    DynMatCardComponent,
    DynMatCheckboxComponent,
    DynMatContainerComponent,
    DynMatDatepickerComponent,
    DynMatDividerComponent,
    DynMatInputComponent,
    DynMatMulticheckboxComponent,
    DynMatRadioComponent,
    DynMatSelectComponent,
  ],
  // FIXME added for Stackblitz
  entryComponents: [
    DynMatArrayComponent,
    DynMatCardComponent,
    DynMatCheckboxComponent,
    DynMatContainerComponent,
    DynMatDatepickerComponent,
    DynMatDividerComponent,
    DynMatInputComponent,
    DynMatMulticheckboxComponent,
    DynMatRadioComponent,
    DynMatSelectComponent,
  ],
  exports: [
    // reduce the boilerplate
    DynFormsModule,
    MatDialogModule,
  ]
})
export class DynFormsMaterialModule {
  static forFeature(): ModuleWithProviders<DynFormsMaterialModule> {
    return {
      ngModule: DynFormsMaterialModule,
      providers: PROVIDERS,
    };
  }
}
