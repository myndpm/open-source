import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { LayoutWrapperComponent } from '../layout';
import { IndexComponent } from './components/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutWrapperComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: IndexComponent,
      },
      {
        path: 'dyn-forms',
        loadChildren: () =>
          import('./submodules/dyn-forms/dyn-forms.module').then(
            (m) => m.DemoFormsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
  ],
  declarations: [IndexComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DemosModule {}
