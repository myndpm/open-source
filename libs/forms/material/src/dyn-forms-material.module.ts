import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynArrayComponent } from './components/array/array.component';
import { DynCardComponent } from './components/card/card.component';
import { DynInputComponent } from './components/input/input.component';
import { DynRadioComponent } from './components/radio/radio.component';
import { DynSelectComponent } from './components/select/select.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    DynFormsModule,
  ],
  declarations: [
    DynArrayComponent,
    DynCardComponent,
    DynInputComponent,
    DynRadioComponent,
    DynSelectComponent,
  ],
})
export class DynFormsMaterialModule {
  static forFeature(): ModuleWithProviders<DynFormsMaterialModule> {
    return DynFormsModule.forFeature({
      controls: [
        {
          control: DynArrayComponent.dynControl,
          instance: DynArrayComponent.dynInstance,
          component: DynArrayComponent,
        },
        {
          control: DynCardComponent.dynControl,
          instance: DynCardComponent.dynInstance,
          component: DynCardComponent,
        },
        {
          control: DynInputComponent.dynControl,
          instance: DynInputComponent.dynInstance,
          component: DynInputComponent,
        },
        {
          control: DynRadioComponent.dynControl,
          instance: DynRadioComponent.dynInstance,
          component: DynRadioComponent,
        },
        {
          control: DynSelectComponent.dynControl,
          instance: DynSelectComponent.dynInstance,
          component: DynSelectComponent,
        },
      ],
    });
  }
}
