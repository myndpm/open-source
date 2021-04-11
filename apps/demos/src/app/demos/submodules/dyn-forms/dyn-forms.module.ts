import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { DynLogLevel, DYN_LOG_LEVEL } from '@myndpm/dyn-forms/core';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/material';
import { LayoutModule } from '../../../layout';
import { SimpleComponent } from './components/simple/simple.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'simple-form',
  },
  {
    path: 'simple-form',
    component: SimpleComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DynFormsMaterialModule.forFeature(),
    MatButtonModule,
    LayoutModule,
  ],
  declarations: [
    SimpleComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        hideRequiredMarker: true,
        floatLabel: 'auto', // also set in INPUT.params.floatLabel
      },
    },
    {
      provide: DYN_LOG_LEVEL,
      useValue: DynLogLevel.Verbose,
    },
  ],
})
export class DemoFormsModule {}
