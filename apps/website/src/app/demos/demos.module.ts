import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
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
    LayoutModule,
  ],
  declarations: [IndexComponent],
})
export class DemosModule {}
