import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule, MAT_LEGACY_SELECT_SCROLL_STRATEGY_PROVIDER as MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/legacy-select';
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
