import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import { DocsIndexComponent } from './components/docs/docs.component';
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
        path: 'docs',
        component: DocsIndexComponent,
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
    DocsIndexComponent,
    HomepageComponent,
    NotFoundComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class PagesModule {}
