import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import { LayoutComponent } from './components/layout/layout.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ExampleComponent } from './components/example/example.component';
import { StackblitzComponent } from './components/stackblitz/stackblitz.component';
import { ContentService } from './services';

const routes: Routes = [
  {
    path: '',
    component: LayoutWrapperComponent,
    children: [
      {
        path: '**',
        component: LayoutComponent,
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
    MatTabsModule,
    MatExpansionModule,
    MatListModule,
    LayoutModule,
  ],
  declarations: [
    LayoutComponent,
    ViewerComponent,
    ExampleComponent,
    StackblitzComponent,
  ],
  providers: [
    ContentService,
  ],
})
export class DocsModule {}
