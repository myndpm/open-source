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
import { DynModuleProviders, getModuleProviders } from '@myndpm/dyn-forms/core';
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
  DynMatTableComponent,
  DynMatTableRowComponent,
} from './controls';
import {
  DynMatFormFieldWrapper,
} from './wrappers';

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
    DynMatFormFieldWrapper,
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
    DynMatTableComponent,
    DynMatTableRowComponent,
  ],
  exports: [
    // reduce the boilerplate
    DynFormsModule,
    MatDialogModule,
  ]
})
export class DynFormsMaterialModule {
  static forFeature(args?: DynModuleProviders): ModuleWithProviders<DynFormsMaterialModule> {
    return {
      ngModule: DynFormsMaterialModule,
      providers: getModuleProviders({
        ...args,
        providers: [
          MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
          ...(args?.providers ?? []),
        ],
        wrappers: [
          DynMatFormFieldWrapper,
          ...(args?.wrappers ?? []),
        ],
        controls: [
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
          DynMatTableComponent,
          ...(args?.controls ?? []),
        ],
      }),
    };
  }
}
