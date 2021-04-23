import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import { StackblitzComponent } from './components/stackblitz/stackblitz.component';
import { ViewerComponent } from './components/viewer/viewer.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutWrapperComponent,
    children: [
      {
        path: '**',
        component: ViewerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    LayoutModule,
  ],
  declarations: [
    StackblitzComponent,
    ViewerComponent,
  ],
})
export class DocsModule {}
