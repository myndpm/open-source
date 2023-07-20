import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule, LayoutWrapperComponent } from '../layout';
import { LayoutComponent } from './components/layout/layout.component';
import { ContentComponent } from './components/content/content.component';
import { ExampleComponent } from './components/example/example.component';
import { ViewerComponent } from './components/viewer/viewer.component';
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
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    LayoutModule,
  ],
  declarations: [
    LayoutComponent,
    ContentComponent,
    ExampleComponent,
    ViewerComponent,
    StackblitzComponent,
  ],
  providers: [
    ContentService,
  ],
})
export class DocsModule {}
