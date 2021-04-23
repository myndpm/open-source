import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CustomBreakPointsProvider } from './bootstrap-breakpoints';
import { LayoutModule, LayoutWrapperComponent } from './layout';
import { NotFoundComponent } from './pages/components/not-found/not-found.component';
import { PagesModule } from './pages/pages.module';

const routes: Routes = [
  {
    path: 'demos',
    loadChildren: () =>
      import('./demos/demos.module').then((m) => m.DemosModule),
  },
  {
    path: 'docs',
    loadChildren: () =>
      import('./docs/docs.module').then((m) => m.DocsModule),
  },
  {
    path: '**',
    component: LayoutWrapperComponent,
    children: [
      {
        path: '',
        component: NotFoundComponent
      },
    ],
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      useHash: true,
    }),
    LayoutModule,
    PagesModule,
  ],
  providers: [CustomBreakPointsProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
