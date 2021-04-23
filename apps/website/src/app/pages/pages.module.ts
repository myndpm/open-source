import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutWrapperComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomepageComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    LayoutModule,
  ],
  declarations: [
    HomepageComponent,
    NotFoundComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class PagesModule {}
