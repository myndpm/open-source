import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynMatArrayComponent } from './components/array/array.component';
import { DynMatCardComponent } from './components/card/card.component';
import { DynMatDividerComponent } from './components/divider/divider.component';
import { DynMatInputComponent } from './components/input/input.component';
import { DynMatRadioComponent } from './components/radio/radio.component';
import { DynMatSelectComponent } from './components/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
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
    DynMatDividerComponent,
    DynMatInputComponent,
    DynMatRadioComponent,
    DynMatSelectComponent,
  ],
  // @deprecated added just for stackblitz
  entryComponents: [
    DynMatArrayComponent,
    DynMatCardComponent,
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
