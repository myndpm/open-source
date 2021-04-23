import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import {
  HomeComponent,
  StackblitzComponent,
  ViewerComponent,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: LayoutWrapperComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
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
    LayoutModule,
  ],
  declarations: [
    StackblitzComponent,
    ViewerComponent,
    HomeComponent,
  ],
})
export class DocsModule {}
