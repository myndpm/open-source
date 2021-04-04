import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
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
    RouterModule.forChild(routes),
    DynFormsMaterialModule.forFeature(),
    MatSelectModule,
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
        floatLabel: 'auto',
      },
    },
  ],
})
export class DemoFormsModule {}
