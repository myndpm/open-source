import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { DYN_LOG_LEVEL, DynLogLevel } from '@myndpm/dyn-forms/logger';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material';
import { LayoutModule } from '../../../layout';
import { BuilderComponent } from './components/builder/builder.component';
import { SimpleComponent } from './components/simple/simple.component';
import { StepperStep1Component } from './components/stepper/step1/step1.component';
import { StepperStep2Component } from './components/stepper/step2/step2.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepperSummaryComponent } from './components/stepper/summary/summary.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'simple-form',
  },
  {
    path: 'builder',
    component: BuilderComponent,
  },
  {
    path: 'simple-form',
    component: SimpleComponent,
  },
  {
    path: 'stepper-form',
    component: StepperComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'step-1',
      },
      {
        path: 'step-1',
        component: StepperStep1Component,
      },
      {
        path: 'step-2',
        component: StepperStep2Component,
      },
      {
        path: 'summary',
        component: StepperSummaryComponent,
      },
    ],
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
    MatNativeDateModule,
    LayoutModule,
  ],
  declarations: [
    BuilderComponent,
    SimpleComponent,
    StepperComponent,
    StepperStep1Component,
    StepperStep2Component,
    StepperSummaryComponent,
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
      useValue: DynLogLevel.Fatal,
    },
  ],
})
export class DemoFormsModule {}
