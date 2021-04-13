import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import {
  DynMatArrayComponent,
  DynMatCardComponent,
  DynMatCheckboxComponent,
  DynMatDividerComponent,
  DynMatInputComponent,
  DynMatRadioComponent,
  DynMatSelectComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
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
    DynMatDividerComponent,
    DynMatInputComponent,
    DynMatRadioComponent,
    DynMatSelectComponent,
  ],
  // @deprecated added for stackblitz
  entryComponents: [
    DynMatArrayComponent,
    DynMatCardComponent,
    DynMatCheckboxComponent,
    DynMatDividerComponent,
    DynMatInputComponent,
    DynMatRadioComponent,
    DynMatSelectComponent,
  ],
  exports: [
    DynFormsModule, // reduce the boilerplate
  ]
})
export class DynFormsMaterialModule {
  static forFeature(): ModuleWithProviders<DynFormsMaterialModule> {
    return DynFormsModule.forFeature({
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
  }
}
